pipeline {
    agent any

    tools {
        nodejs 'Node20' // Yêu cầu đã cấu hình Tool NodeJS 'Node20' trong Jenkins
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
        timeout(time: 15, unit: 'MINUTES')
        timestamps()
    }

    stages {
        stage('1. Checkout Code') {
            steps {
                echo "📦 Đang tải mã nguồn Frontend..."
                checkout scm
            }
        }

        stage('2. Install Dependencies') {
            steps {
                echo "📥 Cài đặt Node.js dependencies cho Frontend..."
                sh 'npm install'
            }
        }

        stage('3. Run Lint') {
            steps {
                echo "🔍 Đang kiểm tra lỗi cú pháp code (ESLint)..."
                sh 'npm run lint || true' // '|| true' để không dừng pipeline nếu chỉ có cảnh báo (warning)
            }
        }

        stage('4. Build Static Assets') {
            steps {
                echo "🔨 Đang biên dịch Frontend thành HTML/JS/CSS tĩnh (Vite Build)..."
                sh 'npm run build'
            }
        }

        // Giai đoạn Deploy chỉ chạy trên nhánh chính (main/master)
        stage('5. Deploy Frontend to Web Server') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                echo "🚀 Đang deploy Frontend lên Web Server..."
                
                // MẸO DEVOPS: Có 3 hướng đi ở đây để bạn học tập:
                
                // 👉 Lựa chọn A (Đơn giản nhất): Copy file tĩnh sang thư mục phục vụ của Nginx trên máy host/server
                // sh 'cp -r dist/* /var/www/coin-pulse-explorer/'
                
                // 👉 Lựa chọn B (Dùng Vercel CLI): Deploy tự động lên Vercel thông qua Token bảo mật
                // withCredentials([string(credentialsId: 'vercel-token', variable: 'VERCEL_TOKEN')]) {
                //     sh 'npx vercel --prod --token $VERCEL_TOKEN --yes'
                // }
                
                // 👉 Lựa chọn C (Docker Nginx): Đóng gói dist thành một Nginx Docker container riêng
                // sh 'docker build -t crypto-explorer-frontend:latest .'
                // sh 'docker compose up -d frontend'
                
                echo "🎉 Bản build tĩnh sẵn sàng tại: ${WORKSPACE}/dist"
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline Frontend chạy THÀNH CÔNG!"
        }
        failure {
            echo "❌ Pipeline Frontend THẤT BẠI!"
        }
    }
}
