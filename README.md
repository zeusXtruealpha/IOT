### Water Quality Monitoring System

Hey there! Welcome to AquaQuality - your smart solution for monitoring water quality in real-time! We've built this system to make water quality monitoring more efficient and accessible. Whether you're monitoring drinking water, industrial water, or environmental water bodies, this platform has got you covered!

## What's Inside? 

### Real-time Monitoring
Features to help you keep track of water quality:

- Live monitoring that shows you what's happening right now
- Interactive dashboards that make it easy to spot quality issues
- Smart analytics that help you understand water quality patterns

### Data Analytics
Making water quality analysis better:

- Plan and optimize monitoring schedules
- Keep track of historical data and make real-time updates
- Monitor parameters in real-time to provide accurate information

### Machine Learning Integration
Making water quality prediction smarter:

- Easy-to-use prediction models
- Smart scheduling system for maintenance
- Track water quality trends in real-time

### User Management
Keeping things secure and personal:

- Safe and secure login system
- Personalized dashboards for users
- Easy data export functionality

## Tech Stuff 🛠️

Used to build this:

- React.js for the frontend
- TypeScript for type safety
- Tailwind CSS for styling
- ThingSpeak for IoT data storage
- ESP32 for hardware control

## Getting Started 🚀

### What You'll Need
- Node.js (v14 or higher)
- npm (v6 or higher)
- ESP32 Microcontroller
- Analog TDS Sensor
- DS18B20 Temperature Sensor
- Breadboard and connecting wires
- Power supply

### Let's Get It Running!

First, clone the repository:
```bash
git clone <>
cd aquaquality
```

Install the dependencies:
```bash
npm install
```

Set up ThingSpeak:
1. Create a new ThingSpeak channel
2. Configure your ESP32 with the ThingSpeak API key
3. Update the configuration in your code

Start the development server:
```bash
npm run dev
```

## Project Structure 📁

Here's how we've organized things:

```
src/
├── components/         # All our React components
│   ├── SensorCard.tsx
│   ├── WaterQualityChart.tsx
│   ├── ModelCard.tsx
│   └── ... (and more!)
├── pages/             # Page components
│   ├── Home.tsx
│   ├── Dashboard.tsx
│   ├── DataAnalytics.tsx
│   └── ... (and more!)
├── services/          # API and service functions
│   ├── thingspeak.ts
│   └── mlModels.ts
└── styles/           # CSS and styling files
    └── index.css
```

## Dependencies 📦

Here are the main packages we're using:

### Core Stuff
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2",
    "@tanstack/react-query": "^5.56.2",
    "recharts": "^2.12.7",
    "lucide-react": "^0.462.0",
    "tailwindcss": "^3.4.11",
    "shadcn/ui": "latest"
  }
}
```

### Development Tools
```json
{
  "devDependencies": {
    "typescript": "^5.5.3",
    "vite": "^5.4.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.11"
  }
}
```

### Handy Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  }
}
```

## Data Interpretation 📊

Understanding your water quality data:

- EC Values:
  - Below 300 μS/cm: Very pure water
  - 300-600 μS/cm: Good for drinking water
  - Above 900 μS/cm: May require treatment

## Want to Contribute? 🤝

We'd love to have your help! Here's how you can contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📝

This project is licensed under the MIT License - feel free to use it for your own projects!

## Get in Touch 📫

Have questions? Want to chat? Reach out to us!

Your Name - [niranjan.galla.7@gmail.com]

Project Link: [https://github.com/zeusXtruealpha/IOT]

![Screenshot 2025-05-16 9 01 44 PM](https://github.com/user-attachments/assets/04c9b3c1-9093-405a-9333-e8612e982403)
![Screenshot 2025-05-16 9 01 38 PM](https://github.com/user-attachments/assets/44e9591d-0290-4dbe-adec-edc275b0d28a)
![Screenshot 2025-05-16 9 01 56 PM](https://github.com/user-attachments/assets/7a776a87-56d0-4d08-a17b-f71ebfdf5a7f)
![Screenshot 2025-05-16 9 01 44 PM](https://github.com/user-attachments/assets/b47a4ad7-33b9-4c4d-a287-3bfbc858bf0a)
![Screenshot 2025-05-16 9 02 04 PM](https://github.com/user-attachments/assets/0aee07c8-60e8-478f-8731-554fd98dd36c)
![Screenshot 2025-05-16 9 01 56 PM](https://github.com/user-attachments/assets/688056a5-f822-4ca8-9cc9-01d9fcc572c9)
![Screenshot 2025-05-16 9 02 19 PM](https://github.com/user-attachments/assets/91ed2206-6330-48af-9c46-ed96d3496058)
![Screenshot 2025-05-16 9 02 04 PM](https://github.com/user-attachments/assets/a905855c-5709-4671-863b-0122098d9a43)
![Screenshot 2025-05-16 9 02 19 PM](https://github.com/user-attachments/assets/fc21ccbd-c6e6-421e-b46e-5b61e1f69aac)
![Screenshot 2025-05-16 9 02 56 PM](https://github.com/user-attachments/assets/73d5f3e0-a2ad-492c-a7e0-02bfc619fc8c)
![Screenshot 2025-05-16 9 02 56 PM](https://github.com/user-attachments/assets/9a13d5b6-793d-48f2-b8b8-dc5050b4ba93)
![Screenshot 2025-05-16 9 03 13 PM](https://github.com/user-attachments/assets/6f55808d-eb02-4027-8415-973643296ad2)
![Screenshot 2025-05-16 9 03 13 PM](https://github.com/user-attachments/assets/9477e4bf-d1cc-43b5-9d83-efa68cc588b4)
![Screenshot 2025-05-16 9 03 25 PM](https://github.com/user-attachments/assets/a779ccaf-a6f9-46fd-8b98-024209c20e80)
![Screenshot 2025-05-16 9 03 25 PM](https://github.com/user-attachments/assets/0ef7f7d9-89f3-4255-9fe0-2f99d7137484)
![Screenshot 2025-05-16 9 03 36 PM](https://github.com/user-attachments/assets/e0d454c3-43d7-41fc-a255-5dab0a696230)
![Screenshot 2025-05-16 9 03 36 PM](https://github.com/user-attachments/assets/ff1d1b9a-a3c5-4ce0-85c7-88367d8224bc)
![Screenshot 2025-05-16 9 04 10 PM](https://github.com/user-attachments/assets/c9cc2fc3-0ae0-43d3-9820-c88c9048ea6c)
![Screenshot 2025-05-16 9 04 10 PM](https://github.com/user-attachments/assets/8670c4c0-57bb-4eb6-aa74-35898bc37a31)
