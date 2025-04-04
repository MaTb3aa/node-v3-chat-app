pipeline {
    agent any
    
    environment {
        PORT = "3000"
        DOCKER_IMAGE = "matb3a-chat-app"
    }
    
    stages {
        stage('Install Node.js') {
            steps {
                // Install Node.js on the Jenkins agent
                sh '''
                    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                    sudo apt-get install -y nodejs
                    node --version
                    npm --version
                '''
            }
        }
        
        stage('Build Application') {
            steps {
                sh '''
                    npm install
                    npm run build  # If you have a build step
                '''
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:latest", "--build-arg NODE_ENV=production .")
                }
            }
        }
        
        stage('Run Container') {
            steps {
                script {
                    sh "docker stop ${DOCKER_IMAGE} || true"
                    sh "docker rm ${DOCKER_IMAGE} || true"
                    sh "docker run -d --name ${DOCKER_IMAGE} -p ${PORT}:${PORT} ${DOCKER_IMAGE}:latest"
                }
            }
        }
    }
    
    post {
        success {
            echo "Chat app deployed successfully! Access it at http://${env.JENKINS_IP}:${PORT}"
        }
        failure {
            echo 'Pipeline failed. Check logs for errors.'
        }
    }
}