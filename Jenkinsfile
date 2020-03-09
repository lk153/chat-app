pipeline {
    agent {
        docker {
            image 'node:13.8.0' 
        } 
    }
    stages {
        stage('build') {
            steps {
                sh 'npm --version'
            }
        }
    }
    post {
        always {
            echo 'post always'
        }
        success {
            echo 'post success'
        }
        failure {
            echo 'post failure'
        }
        unstable {
            echo 'post unstable'
        }
        changed {
            echo 'post changed'
        }
    }
}