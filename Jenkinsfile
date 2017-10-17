stage('Build project') {
  node {
    checkout scm
    echo "Step 1 - Build stage"
    sh "PGPASSWORD=\"changethis\" psql -U rubylens -h localhost ruby-lens -f server/database/schema.sql && PGPASSWORD=\"changethis\" psql -U rubylens -h localhost ruby-lens -f server/database/games.sql"
    sh "exit 0"
  }
}

stage('Moca Chai Tests') {
  node{
    sh "mocha"  
  }
}

stage('Node Security Tests') {
  node{
    sh "npm outdated | awk '{if(NR!=1 && (\$2 != \$3)) print \$1,\" \",\$2,\" is outdated!!! Wanted version is\", \$3,\".\";}'"
    sh "nsp check --output summary"
  }
}

stage('Integration tests') {
  node {
    echo "Step 4 - integration stage not implemented yet"
    sh "exit 0"
  }
}

stage('Stage Deployment') {
  node {
    sshagent (credentials: ['ubuntu']) {
      sh 'ssh -o StrictHostKeyChecking=no 35.162.117.75 docker exec rubylens-stg-server /usr/bin/git pull'
    }
  }
}
