pipeline {
    agent any
    environment {
        // Optional: Set environment variables if needed (e.g., PORT)
        PORT = "3000"
    }
    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image from your Dockerfile
                    docker.build("matb3a-chat-app:latest", "--build-arg NODE_ENV=production .")
                }
            }
        }
        stage('Run Container') {
            steps {
                script {
                    // Stop and remove any existing container (prevent conflicts)
                    sh 'docker stop matb3a-chat-app || true'
                    sh 'docker rm matb3a-chat-app || true'
                    // Run the container in detached mode, mapping port 3000
                    sh 'docker run -d --name matb3a-chat-app -p 3000:3000 matb3a-chat-app:latest'
                }
            }
        }
    }
    post {
        success {
            echo 'Chat app deployed successfully! Access it at http://<JENKINS_IP>:3000'
        }
        failure {
            echo 'Pipeline failed. Check logs for errors.'
        }
    }
}