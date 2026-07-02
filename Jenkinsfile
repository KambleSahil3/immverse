pipeline {
    agent any

    environment {
        IMAGE_NAME    = "tictactoe"
        AWS_REGION    = "us-east-1"
        ECR_REGISTRY  = "<AWS_ACCOUNT_ID>.dkr.ecr.${AWS_REGION}.amazonaws.com"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Test') {
            steps {
                sh 'npm ci --ignore-scripts'
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${env.BUILD_NUMBER} ."
            }
        }

        stage('Image Scan') {
            steps {
                sh "trivy image --exit-code 1 --severity HIGH,CRITICAL ${IMAGE_NAME}:${env.BUILD_NUMBER}"
            }
        }

        stage('Push to ECR') {
            steps {
                withCredentials([
                    string(credentialsId: 'AWS_ACCESS_KEY_ID', variable: 'AWS_ACCESS_KEY_ID'),
                string(credentialsId: 'AWS_SECRET_ACCESS_KEY', variable: 'AWS_SECRET_ACCESS_KEY'),
                    string(credentialsId: 'AWS_ACCOUNT_ID', variable: 'AWS_ACCOUNT_ID')
                ]) {
                sh """
                    aws ecr get-login-password --region ${AWS_REGION} | \
                        docker login --username AWS --password-stdin ${ECR_REGISTRY}
                    docker tag ${IMAGE_NAME}:${env.BUILD_NUMBER} ${ECR_REGISTRY}/${IMAGE_NAME}:${env.BUILD_NUMBER}
                    docker tag ${IMAGE_NAME}:${env.BUILD_NUMBER} ${ECR_REGISTRY}/${IMAGE_NAME}:latest
                    docker push ${ECR_REGISTRY}/${IMAGE_NAME}:${env.BUILD_NUMBER}
                    docker push ${ECR_REGISTRY}/${IMAGE_NAME}:latest
                """
                }
            }
        }

        stage('Deploy') {
            steps {
                    sh """
                        kubectl set image deployment/tictactoe tictactoe=${ECR_REGISTRY}/${IMAGE_NAME}:${env.BUILD_NUMBER}
                        kubectl rollout status deployment/tictactoe
                    """
            }
        }
    }

    post {
    always {
      sh "docker rmi ${IMAGE_NAME}:${env.BUILD_NUMBER} || true"
      cleanWs()
    }
    failure {
      echo "Pipeline failed."
    }
  }
}