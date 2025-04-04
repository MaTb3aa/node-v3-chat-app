pipeline {
    agent any
    environment {
        PORT = 3000 // Override if needed
    }
    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test' // Add tests if missing
            }
        }
        stage('Deploy') {
            steps {
                sh 'npm start &' // Run in background
            }
        }
    }
}