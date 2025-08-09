from flask import Blueprint, jsonify, request
from flask_socketio import emit
import random
import time
import threading
from datetime import datetime, timedelta
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import json

ddos_bp = Blueprint('ddos', __name__)

# Global variables for simulation state
simulation_active = False
simulation_thread = None
traffic_data = []
detection_results = []
ml_model = None
scaler = None

# Initialize ML model for demonstration
def initialize_ml_model():
    global ml_model, scaler
    
    # Generate synthetic training data for demonstration
    np.random.seed(42)
    n_samples = 1000
    
    # Features: packet_rate, unique_ips, avg_packet_size, protocol_diversity, connection_rate
    normal_data = np.random.normal([100, 50, 1024, 0.8, 20], [20, 10, 200, 0.1, 5], (n_samples//2, 5))
    attack_data = np.random.normal([1000, 10, 64, 0.2, 200], [200, 5, 20, 0.05, 50], (n_samples//2, 5))
    
    X = np.vstack([normal_data, attack_data])
    y = np.hstack([np.zeros(n_samples//2), np.ones(n_samples//2)])
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    ml_model = RandomForestClassifier(n_estimators=100, random_state=42)
    ml_model.fit(X_scaled, y)
    
    return ml_model, scaler

# Generate simulated traffic data
def generate_traffic_data(attack_type=None, intensity=1.0):
    timestamp = datetime.now()
    
    if attack_type is None:
        # Normal traffic
        packet_rate = random.randint(80, 120)
        unique_ips = random.randint(40, 60)
        avg_packet_size = random.randint(800, 1200)
        protocol_diversity = random.uniform(0.7, 0.9)
        connection_rate = random.randint(15, 25)
        is_attack = False
    else:
        # Attack traffic based on type and intensity
        base_multiplier = intensity * 10
        
        if attack_type == 'syn_flood':
            packet_rate = random.randint(int(800 * intensity), int(1200 * intensity))
            unique_ips = random.randint(5, 15)
            avg_packet_size = random.randint(40, 80)
            protocol_diversity = random.uniform(0.1, 0.3)
            connection_rate = random.randint(int(150 * intensity), int(250 * intensity))
        elif attack_type == 'udp_flood':
            packet_rate = random.randint(int(600 * intensity), int(1000 * intensity))
            unique_ips = random.randint(8, 20)
            avg_packet_size = random.randint(32, 64)
            protocol_diversity = random.uniform(0.15, 0.25)
            connection_rate = random.randint(int(100 * intensity), int(200 * intensity))
        elif attack_type == 'http_flood':
            packet_rate = random.randint(int(400 * intensity), int(800 * intensity))
            unique_ips = random.randint(10, 25)
            avg_packet_size = random.randint(200, 400)
            protocol_diversity = random.uniform(0.2, 0.4)
            connection_rate = random.randint(int(80 * intensity), int(150 * intensity))
        
        is_attack = True
    
    # Generate individual packet data
    packets = []
    for i in range(packet_rate):
        packet = {
            'timestamp': (timestamp + timedelta(milliseconds=i * (1000 / packet_rate))).isoformat(),
            'source_ip': f"192.168.{random.randint(1, 255)}.{random.randint(1, 255)}",
            'destination_ip': "10.0.0.1",
            'protocol': random.choice(['TCP', 'UDP', 'HTTP']),
            'packet_size': random.randint(avg_packet_size - 100, avg_packet_size + 100),
            'is_malicious': is_attack
        }
        packets.append(packet)
    
    # Aggregate data for ML detection
    features = [packet_rate, unique_ips, avg_packet_size, protocol_diversity, connection_rate]
    
    return {
        'timestamp': timestamp.isoformat(),
        'packet_rate': packet_rate,
        'unique_ips': unique_ips,
        'avg_packet_size': avg_packet_size,
        'protocol_diversity': protocol_diversity,
        'connection_rate': connection_rate,
        'packets': packets,
        'features': features,
        'is_attack': is_attack,
        'attack_type': attack_type
    }

# ML-based attack detection
def detect_attack(traffic_features):
    global ml_model, scaler
    
    if ml_model is None or scaler is None:
        initialize_ml_model()
    
    # Scale features
    features_scaled = scaler.transform([traffic_features])
    
    # Predict
    prediction = ml_model.predict(features_scaled)[0]
    confidence = ml_model.predict_proba(features_scaled)[0].max()
    
    return {
        'is_attack': bool(prediction),
        'confidence': float(confidence),
        'attack_probability': float(ml_model.predict_proba(features_scaled)[0][1])
    }

# Simulation thread function
def simulation_worker(attack_type=None, intensity=1.0, duration=60):
    global simulation_active, traffic_data, detection_results
    
    start_time = time.time()
    
    while simulation_active and (time.time() - start_time) < duration:
        # Generate traffic data
        traffic = generate_traffic_data(attack_type, intensity)
        traffic_data.append(traffic)
        
        # Detect attack using ML
        detection = detect_attack(traffic['features'])
        detection['timestamp'] = traffic['timestamp']
        detection_results.append(detection)
        
        # Keep only last 100 data points
        if len(traffic_data) > 100:
            traffic_data.pop(0)
        if len(detection_results) > 100:
            detection_results.pop(0)
        
        # Emit real-time data via WebSocket (if SocketIO is available)
        try:
            from flask_socketio import emit
            emit('traffic_update', {
                'traffic': traffic,
                'detection': detection
            }, broadcast=True)
        except:
            pass
        
        time.sleep(1)  # Update every second
    
    simulation_active = False

@ddos_bp.route('/status', methods=['GET'])
def get_status():
    """Get current simulation status"""
    return jsonify({
        'simulation_active': simulation_active,
        'data_points': len(traffic_data),
        'last_update': traffic_data[-1]['timestamp'] if traffic_data else None
    })

@ddos_bp.route('/start', methods=['POST'])
def start_simulation():
    """Start DDoS simulation"""
    global simulation_active, simulation_thread
    
    if simulation_active:
        return jsonify({'error': 'Simulation already running'}), 400
    
    data = request.get_json() or {}
    attack_type = data.get('attack_type')  # None, 'syn_flood', 'udp_flood', 'http_flood'
    intensity = data.get('intensity', 1.0)
    duration = data.get('duration', 60)
    
    simulation_active = True
    simulation_thread = threading.Thread(
        target=simulation_worker,
        args=(attack_type, intensity, duration)
    )
    simulation_thread.start()
    
    return jsonify({
        'message': 'Simulation started',
        'attack_type': attack_type,
        'intensity': intensity,
        'duration': duration
    })

@ddos_bp.route('/stop', methods=['POST'])
def stop_simulation():
    """Stop DDoS simulation"""
    global simulation_active
    
    simulation_active = False
    
    return jsonify({'message': 'Simulation stopped'})

@ddos_bp.route('/data', methods=['GET'])
def get_data():
    """Get current traffic and detection data"""
    return jsonify({
        'traffic_data': traffic_data[-20:],  # Last 20 data points
        'detection_results': detection_results[-20:]
    })

@ddos_bp.route('/clear', methods=['POST'])
def clear_data():
    """Clear all simulation data"""
    global traffic_data, detection_results
    
    traffic_data.clear()
    detection_results.clear()
    
    return jsonify({'message': 'Data cleared'})

@ddos_bp.route('/model-info', methods=['GET'])
def get_model_info():
    """Get ML model information"""
    global ml_model
    
    if ml_model is None:
        initialize_ml_model()
    
    return jsonify({
        'model_type': 'Random Forest Classifier',
        'n_estimators': ml_model.n_estimators,
        'features': [
            'packet_rate',
            'unique_ips', 
            'avg_packet_size',
            'protocol_diversity',
            'connection_rate'
        ],
        'feature_importance': ml_model.feature_importances_.tolist()
    })

# Initialize ML model on module load
initialize_ml_model()

