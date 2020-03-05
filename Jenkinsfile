pipeline {
    agent { docker { image 'node:13.8.0' } }
    stages {
        stage('build') {
            steps {
                sh 'npm --version'
            }
        }
    }
}