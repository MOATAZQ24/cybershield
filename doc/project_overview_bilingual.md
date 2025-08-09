# CyberShield Project Overview & File Descriptions

## 1. Project Overview (English)

**CyberShield** is a web-based interactive simulation platform designed to demonstrate and educate about **DDoS (Distributed Denial of Service) attack detection and mitigation**. It provides a practical, visual environment where users can simulate various DDoS attack types, observe real-time network traffic, and visualize attack detection using a simplified, rule-based machine learning approach. The project aims to make complex cybersecurity threats understandable through hands-on, visual simulation.

**What the project DOES:**
- Simulates various DDoS attack types (SYN Flood, UDP Flood, HTTP Flood).
- Displays real-time network traffic and metrics.
- Demonstrates a simplified, rule-based machine learning detection mechanism.
- Provides an interactive web interface for controlling simulations and viewing results.
- Offers a full-stack web application experience (frontend and backend).
- Is suitable as an educational tool and a graduation project.

**What the project DOES NOT do (current version):**
- Does not use a complex, real-world trained machine learning model (uses a rule-based simulation for simplicity and ease of deployment).
- Does not integrate with real network traffic or live systems.
- Does not perform actual mitigation actions on a network.
- Does not include advanced cybersecurity tools like Wireshark, Nmap, or Metasploit (this is a feature for a *future, more complex* version).

**Frameworks Used:**
- **Frontend**: React (with Vite, Tailwind CSS, shadcn/ui, Recharts)
- **Backend**: Flask (Python)
- **API**: RESTful APIs

**Setup Way:**
The project can be set up and run using a simple shell script (`run_cybershield.sh`) that automates the environment setup and server启动. Manual setup instructions are also provided.

---

## 2. نظرة عامة على المشروع (العربية)

**سايبر شيلد (CyberShield)** هو منصة محاكاة تفاعلية قائمة على الويب مصممة لعرض وتوضيح كيفية **اكتشاف هجمات الحرمان من الخدمة الموزعة (DDoS) والتخفيف منها**. توفر المنصة بيئة عملية ومرئية حيث يمكن للمستخدمين:

-   **محاكاة أنواع مختلفة من هجمات DDoS** (مثل SYN Flood، UDP Flood، HTTP Flood) جنبًا إلى جنب مع حركة مرور الشبكة العادية.
-   **مراقبة أنماط حركة مرور الشبكة في الوقت الفعلي** والمقاييس.
-   **تصور اكتشاف هذه الهجمات** باستخدام نهج تعلم آلي مبسط قائم على القواعد.
-   **فهم تأثير هجمات DDoS** والمبادئ الكامنة وراء اكتشافها بطريقة سهلة الوصول.

**ما يفعله المشروع:**
- يحاكي أنواعًا مختلفة من هجمات DDoS (SYN Flood، UDP Flood، HTTP Flood).
- يعرض حركة مرور الشبكة والمقاييس في الوقت الفعلي.
- يوضح آلية كشف مبسطة قائمة على قواعد التعلم الآلي.
- يوفر واجهة ويب تفاعلية للتحكم في المحاكاة وعرض النتائج.
- يقدم تجربة تطبيق ويب كامل المكدس (واجهة أمامية وخلفية).
- مناسب كأداة تعليمية ومشروع تخرج.

**ما لا يفعله المشروع (الإصدار الحالي):**
- لا يستخدم نموذج تعلم آلي معقد ومدرب في العالم الحقيقي (يستخدم محاكاة قائمة على القواعد من أجل البساطة وسهولة النشر).
- لا يتكامل مع حركة مرور الشبكة الحقيقية أو الأنظمة الحية.
- لا يقوم بإجراءات تخفيف فعلية على الشبكة.
- لا يتضمن أدوات الأمن السيبراني المتقدمة مثل Wireshark أو Nmap أو Metasploit (هذه ميزة لإصدار *مستقبلي وأكثر تعقيدًا*).

**الأطر المستخدمة (Frameworks):**
- **الواجهة الأمامية (Frontend)**: React (مع Vite، Tailwind CSS، shadcn/ui، Recharts)
- **الواجهة الخلفية (Backend)**: Flask (بايثون)
- **واجهة برمجة التطبيقات (API)**: واجهات برمجة تطبيقات RESTful

**طريقة الإعداد والتشغيل:**
يمكن إعداد المشروع وتشغيله باستخدام نص برمجي بسيط (shell script) يسمى (`run_cybershield.sh`) يقوم بأتمتة إعداد البيئة وتشغيل الخوادم. تتوفر أيضًا تعليمات الإعداد اليدوي.

---

## 3. File Descriptions (English & Arabic)

This section provides a detailed description of the important files within the CyberShield project.

### `cybershield-backend/`
This directory contains the Flask backend application.

-   **`cybershield-backend/src/main.py`**
    -   **English**: The main entry point for the Flask backend application. It initializes the Flask app, configures CORS, registers API blueprints, and serves the React frontend. It acts as the central orchestrator for the backend.
    -   **Arabic**: نقطة الدخول الرئيسية لتطبيق Flask الخلفي. يقوم بتهيئة تطبيق Flask، وتكوين CORS، وتسجيل مخططات API، وخدمة الواجهة الأمامية React. يعمل كمنسق مركزي للواجهة الخلفية.

-   **`cybershield-backend/src/routes/ddos_simulation_simple.py`**
    -   **English**: Defines the API endpoints and core logic for DDoS attack simulation and simplified machine learning-based detection. It generates simulated network traffic and applies rule-based logic to detect attacks. This file is the heart of the simulation and detection logic.
    -   **Arabic**: يحدد نقاط نهاية API والمنطق الأساسي لمحاكاة هجمات DDoS والكشف المبسط القائم على التعلم الآلي. يقوم بتوليد حركة مرور شبكة محاكاة ويطبق منطقًا قائمًا على القواعد لاكتشاف الهجمات. هذا الملف هو جوهر منطق المحاكاة والكشف.

-   **`cybershield-backend/requirements.txt`**
    -   **English**: Lists all Python dependencies required for the Flask backend. Used with `pip install -r requirements.txt` to set up the environment.
    -   **Arabic**: يسرد جميع تبعيات Python المطلوبة للواجهة الخلفية Flask. يستخدم مع `pip install -r requirements.txt` لإعداد البيئة.

### `cybershield-frontend/`
This directory contains the React frontend application.

-   **`cybershield-frontend/src/App.jsx`**
    -   **English**: The main React component that renders the entire user interface. It manages application state, handles user interactions, fetches data from the backend API, and visualizes data using charts. This file is the primary interface for the user.
    -   **Arabic**: المكون الرئيسي لـ React الذي يعرض واجهة المستخدم بأكملها. يدير حالة التطبيق، ويتعامل مع تفاعلات المستخدم، ويجلب البيانات من واجهة برمجة تطبيقات الواجهة الخلفية، ويصور البيانات باستخدام الرسوم البيانية. هذا الملف هو الواجهة الأساسية للمستخدم.

-   **`cybershield-frontend/src/main.jsx`**
    -   **English**: The entry point for the React application. It renders the root `App` component into the HTML document.
    -   **Arabic**: نقطة الدخول لتطبيق React. يقوم بعرض المكون الرئيسي `App` في مستند HTML.

-   **`cybershield-frontend/src/App.css`**
    -   **English**: Contains custom CSS styles for the React application, used for global styles or specific component overrides.
    -   **Arabic**: يحتوي على أنماط CSS مخصصة لتطبيق React، ويستخدم للأنماط العامة أو تجاوزات مكونات محددة.

-   **`cybershield-frontend/src/index.css`**
    -   **English**: Imports Tailwind CSS directives and other base styles, setting up the global CSS for the application.
    -   **Arabic**: يستورد توجيهات Tailwind CSS وأنماط أساسية أخرى، ويقوم بإعداد CSS العام للتطبيق.

-   **`cybershield-frontend/src/components/ui/`**
    -   **English**: Contains UI components from `shadcn/ui`, providing pre-built, accessible, and customizable React components for a consistent look and feel.
    -   **Arabic**: يحتوي على مكونات واجهة المستخدم من `shadcn/ui`، ويوفر مكونات React جاهزة، يمكن الوصول إليها، وقابلة للتخصيص للحصول على مظهر وشعور متناسق.

-   **`cybershield-frontend/src/lib/utils.js`**
    -   **English**: Contains utility functions commonly used across the frontend application, such as functions for combining Tailwind CSS classes.
    -   **Arabic**: يحتوي على وظائف مساعدة تستخدم بشكل شائع في جميع أنحاء تطبيق الواجهة الأمامية، مثل وظائف لدمج فئات Tailwind CSS.

-   **`cybershield-frontend/vite.config.js`**
    -   **English**: Configuration file for Vite, the build tool for the React frontend. It defines how the project is built, served, and optimized.
    -   **Arabic**: ملف التكوين لـ Vite، أداة البناء للواجهة الأمامية React. يحدد كيفية بناء المشروع وتقديمه وتحسينه.

-   **`cybershield-frontend/tailwind.config.js`**
    -   **English**: Configuration file for Tailwind CSS, allowing customization of Tailwind's default theme and extending utilities.
    -   **Arabic**: ملف التكوين لـ Tailwind CSS، يسمح بتخصيص سمة Tailwind الافتراضية وتوسيع الأدوات المساعدة.

-   **`cybershield-frontend/package.json`**
    -   **English**: Defines the frontend project's metadata, scripts, and Node.js dependencies. It lists all required Node.js packages and defines common development/build commands.
    -   **Arabic**: يحدد بيانات تعريف مشروع الواجهة الأمامية، والنصوص البرمجية، وتبعيات Node.js. يسرد جميع حزم Node.js المطلوبة ويحدد أوامر التطوير/البناء الشائعة.

### Other Important Files

-   **`run_cybershield.sh`**
    -   **English**: A shell script that automates the setup and execution of both the Flask backend and React frontend. It installs dependencies and starts the servers, providing a smooth execution experience.
    -   **Arabic**: نص برمجي (shell script) يقوم بأتمتة إعداد وتشغيل كل من الواجهة الخلفية Flask والواجهة الأمامية React. يقوم بتثبيت التبعيات وتشغيل الخوادم، مما يوفر تجربة تشغيل سلسة.

-   **`DOCUMENTATION.md`**
    -   **English**: Comprehensive project documentation covering architecture, API specifications, detailed file-by-file explanations, and a future roadmap.
    -   **Arabic**: توثيق شامل للمشروع يغطي الهندسة المعمارية، ومواصفات واجهة برمجة التطبيقات، وتفسيرات مفصلة للملفات، وخارطة طريق مستقبلية.

-   **`graduation_project_profile.md`**
    -   **English**: A profile document outlining the CyberShield project's idea, development methodology, key focus areas, and its benefits as a graduation project.
    -   **Arabic**: وثيقة تعريفية توضح فكرة مشروع CyberShield، ومنهجية تطويره، ومجالات التركيز الرئيسية، وفوائده كمشروع تخرج.

-   **`graduation_project_profile_ar.md`**
    -   **English**: The Arabic version of the graduation project profile.
    -   **Arabic**: النسخة العربية من وثيقة تعريف مشروع التخرج.

-   **`backend_architecture.png`**
    -   **English**: A visual diagram illustrating the high-level architecture of the CyberShield backend and its components.
    -   **Arabic**: رسم بياني يوضح الهندسة المعمارية عالية المستوى للواجهة الخلفية لـ CyberShield ومكوناتها.

-   **`execution_guide.md`**
    -   **English**: A detailed guide on how to execute the project, including prerequisites, automated and manual setup steps, troubleshooting, and verification methods.
    -   **Arabic**: دليل مفصل حول كيفية تشغيل المشروع، بما في ذلك المتطلبات الأساسية، وخطوات الإعداد التلقائية واليدوية، واستكشاف الأخطاء وإصلاحها، وطرق التحقق.

---

This document provides a clear overview of the CyberShield project and a detailed description of its key files in both English and Arabic, ensuring comprehensive understanding for all users.

