import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { Shield, AlertTriangle, Activity, Play, Square, RotateCcw, Zap, Network, Eye, Brain } from 'lucide-react'
import './App.css'

const API_BASE = '/api'

function App() {
  const [simulationActive, setSimulationActive] = useState(false)
  const [trafficData, setTrafficData] = useState([])
  const [detectionResults, setDetectionResults] = useState([])
  const [currentStatus, setCurrentStatus] = useState('normal')
  const [attackType, setAttackType] = useState('')
  const [intensity, setIntensity] = useState([1.0])
  const [modelInfo, setModelInfo] = useState(null)
  const [alerts, setAlerts] = useState([])

  // Fetch data from backend
  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE}/ddos/data`)
      const data = await response.json()
      
      if (data.traffic_data && data.detection_results) {
        setTrafficData(data.traffic_data)
        setDetectionResults(data.detection_results)
        
        // Update status based on latest detection
        if (data.detection_results.length > 0) {
          const latest = data.detection_results[data.detection_results.length - 1]
          setCurrentStatus(latest.is_attack ? 'attack' : 'normal')
          
          // Add alert if attack detected
          if (latest.is_attack && latest.confidence > 0.8) {
            const newAlert = {
              id: Date.now(),
              timestamp: new Date().toLocaleTimeString(),
              message: `DDoS Attack Detected! Confidence: ${(latest.confidence * 100).toFixed(1)}%`,
              type: 'danger'
            }
            setAlerts(prev => [newAlert, ...prev.slice(0, 4)]) // Keep last 5 alerts
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // Check simulation status
  const checkStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/ddos/status`)
      const data = await response.json()
      setSimulationActive(data.simulation_active)
    } catch (error) {
      console.error('Error checking status:', error)
    }
  }

  // Start simulation
  const startSimulation = async () => {
    try {
      const response = await fetch(`${API_BASE}/ddos/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attack_type: attackType || null,
          intensity: intensity[0],
          duration: 300 // 5 minutes
        })
      })
      
      if (response.ok) {
        setSimulationActive(true)
        const newAlert = {
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          message: `Simulation started${attackType ? ` - ${attackType.replace('_', ' ').toUpperCase()}` : ' - Normal Traffic'}`,
          type: 'info'
        }
        setAlerts(prev => [newAlert, ...prev.slice(0, 4)])
      }
    } catch (error) {
      console.error('Error starting simulation:', error)
    }
  }

  // Stop simulation
  const stopSimulation = async () => {
    try {
      await fetch(`${API_BASE}/ddos/stop`, { method: 'POST' })
      setSimulationActive(false)
      setCurrentStatus('normal')
    } catch (error) {
      console.error('Error stopping simulation:', error)
    }
  }

  // Clear data
  const clearData = async () => {
    try {
      await fetch(`${API_BASE}/ddos/clear`, { method: 'POST' })
      setTrafficData([])
      setDetectionResults([])
      setAlerts([])
      setCurrentStatus('normal')
    } catch (error) {
      console.error('Error clearing data:', error)
    }
  }

  // Fetch model info
  const fetchModelInfo = async () => {
    try {
      const response = await fetch(`${API_BASE}/ddos/model-info`)
      const data = await response.json()
      setModelInfo(data)
    } catch (error) {
      console.error('Error fetching model info:', error)
    }
  }

  useEffect(() => {
    checkStatus()
    fetchModelInfo()
    
    // Set up polling for data updates
    const interval = setInterval(() => {
      fetchData()
      checkStatus()
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])

  // Prepare chart data
  const chartData = trafficData.map((item, index) => ({
    time: new Date(item.timestamp).toLocaleTimeString(),
    packets: item.packet_rate,
    uniqueIPs: item.unique_ips,
    avgSize: item.avg_packet_size,
    confidence: detectionResults[index]?.confidence || 0
  }))

  const attackTypeData = [
    { name: 'Normal', value: trafficData.filter(t => !t.is_attack).length, color: '#10b981' },
    { name: 'SYN Flood', value: trafficData.filter(t => t.attack_type === 'syn_flood').length, color: '#ef4444' },
    { name: 'UDP Flood', value: trafficData.filter(t => t.attack_type === 'udp_flood').length, color: '#f59e0b' },
    { name: 'HTTP Flood', value: trafficData.filter(t => t.attack_type === 'http_flood').length, color: '#8b5cf6' }
  ]

  const featureImportanceData = modelInfo?.feature_importance?.map((importance, index) => ({
    feature: modelInfo.features[index].replace('_', ' ').toUpperCase(),
    importance: (importance * 100).toFixed(1)
  })) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">CyberShield</h1>
                <p className="text-sm text-slate-400">DDoS Detection & Mitigation Demo</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge 
                variant={currentStatus === 'attack' ? 'destructive' : 'default'}
                className={`px-3 py-1 ${currentStatus === 'attack' ? 'bg-red-600' : 'bg-green-600'}`}
              >
                {currentStatus === 'attack' ? (
                  <>
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    UNDER ATTACK
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-1" />
                    SECURE
                  </>
                )}
              </Badge>
              
              <Badge variant="outline" className="text-slate-300 border-slate-600">
                {simulationActive ? (
                  <>
                    <Activity className="h-4 w-4 mr-1 text-green-400" />
                    ACTIVE
                  </>
                ) : (
                  <>
                    <Square className="h-4 w-4 mr-1 text-slate-400" />
                    STOPPED
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Control Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                  Control Panel
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Configure and control the simulation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Attack Type
                  </label>
                  <select 
                    value={attackType} 
                    onChange={(e) => setAttackType(e.target.value)}
                    className="w-full p-2 bg-slate-700 border border-slate-600 text-white rounded-md"
                  >
                    <option value="">Normal Traffic</option>
                    <option value="syn_flood">SYN Flood</option>
                    <option value="udp_flood">UDP Flood</option>
                    <option value="http_flood">HTTP Flood</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Intensity: {intensity[0]}x
                  </label>
                  <Slider
                    value={intensity}
                    onValueChange={setIntensity}
                    max={3}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <Button 
                    onClick={simulationActive ? stopSimulation : startSimulation}
                    className={`w-full ${simulationActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                  >
                    {simulationActive ? (
                      <>
                        <Square className="h-4 w-4 mr-2" />
                        Stop Simulation
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Simulation
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={clearData}
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Alerts Panel */}
            <Card className="bg-slate-800/50 border-slate-700 mt-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
                  Security Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {alerts.length === 0 ? (
                    <p className="text-slate-400 text-sm">No alerts</p>
                  ) : (
                    alerts.map(alert => (
                      <Alert key={alert.id} className={`border-l-4 ${
                        alert.type === 'danger' ? 'border-red-500 bg-red-900/20' : 'border-blue-500 bg-blue-900/20'
                      }`}>
                        <AlertDescription className="text-sm">
                          <span className="text-slate-400">{alert.timestamp}</span>
                          <br />
                          <span className="text-white">{alert.message}</span>
                        </AlertDescription>
                      </Alert>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="traffic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
                <TabsTrigger value="traffic" className="data-[state=active]:bg-blue-600">
                  <Network className="h-4 w-4 mr-2" />
                  Traffic
                </TabsTrigger>
                <TabsTrigger value="detection" className="data-[state=active]:bg-blue-600">
                  <Eye className="h-4 w-4 mr-2" />
                  Detection
                </TabsTrigger>
                <TabsTrigger value="analysis" className="data-[state=active]:bg-blue-600">
                  <Brain className="h-4 w-4 mr-2" />
                  Analysis
                </TabsTrigger>
                <TabsTrigger value="model" className="data-[state=active]:bg-blue-600">
                  <Activity className="h-4 w-4 mr-2" />
                  ML Model
                </TabsTrigger>
              </TabsList>

              <TabsContent value="traffic" className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Real-time Traffic Monitoring</CardTitle>
                    <CardDescription className="text-slate-400">
                      Live network traffic visualization and metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="time" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1f2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px'
                            }}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="packets" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            name="Packets/sec"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="uniqueIPs" 
                            stroke="#10b981" 
                            strokeWidth={2}
                            name="Unique IPs"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-400">Packets/sec</p>
                          <p className="text-2xl font-bold text-white">
                            {trafficData.length > 0 ? trafficData[trafficData.length - 1]?.packet_rate || 0 : 0}
                          </p>
                        </div>
                        <Activity className="h-8 w-8 text-blue-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-400">Unique IPs</p>
                          <p className="text-2xl font-bold text-white">
                            {trafficData.length > 0 ? trafficData[trafficData.length - 1]?.unique_ips || 0 : 0}
                          </p>
                        </div>
                        <Network className="h-8 w-8 text-green-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-400">Avg Packet Size</p>
                          <p className="text-2xl font-bold text-white">
                            {trafficData.length > 0 ? `${trafficData[trafficData.length - 1]?.avg_packet_size || 0}B` : '0B'}
                          </p>
                        </div>
                        <Zap className="h-8 w-8 text-yellow-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="detection" className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Attack Detection Results</CardTitle>
                    <CardDescription className="text-slate-400">
                      Machine learning-based threat detection confidence levels
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="time" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" domain={[0, 1]} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1f2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px'
                            }}
                            formatter={(value) => [`${(value * 100).toFixed(1)}%`, 'Confidence']}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="confidence" 
                            stroke="#ef4444" 
                            strokeWidth={3}
                            name="Detection Confidence"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Traffic Distribution</CardTitle>
                      <CardDescription className="text-slate-400">
                        Breakdown of traffic types detected
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={attackTypeData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {attackTypeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Feature Importance</CardTitle>
                      <CardDescription className="text-slate-400">
                        ML model feature weights for detection
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={featureImportanceData} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis type="number" stroke="#9ca3af" />
                            <YAxis dataKey="feature" type="category" stroke="#9ca3af" width={100} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#1f2937', 
                                border: '1px solid #374151',
                                borderRadius: '8px'
                              }}
                              formatter={(value) => [`${value}%`, 'Importance']}
                            />
                            <Bar dataKey="importance" fill="#8b5cf6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="model" className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Machine Learning Model Information</CardTitle>
                    <CardDescription className="text-slate-400">
                      Details about the DDoS detection algorithm
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {modelInfo ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3">Model Details</h3>
                          <div className="space-y-2">
                            <p className="text-slate-300">
                              <span className="font-medium">Type:</span> {modelInfo.model_type}
                            </p>
                            <p className="text-slate-300">
                              <span className="font-medium">Estimators:</span> {modelInfo.n_estimators}
                            </p>
                            <p className="text-slate-300">
                              <span className="font-medium">Features:</span> {modelInfo.features?.length || 0}
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3">Input Features</h3>
                          <div className="space-y-1">
                            {modelInfo.features?.map((feature, index) => (
                              <Badge key={index} variant="outline" className="mr-2 mb-2 border-slate-600 text-slate-300">
                                {feature.replace('_', ' ').toUpperCase()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-400">Loading model information...</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

