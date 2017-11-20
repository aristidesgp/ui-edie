node {
    properties([
        gitLabConnection('https://gitlab.com'),
        pipelineTriggers([
            [$class: "GitLabPushTrigger", triggerOnPush: true, branchFilterType: "All"]
        ])
    ])

    stage('Build'){
        def branch=env.BRANCH_NAME
        echo "Building ${env.BRANCH_NAME}..."
        checkout scm

        def npm = tool 'nodejs'
        env.PATH = "${npm}/bin:${env.PATH}"
        sh 'cd ui && npm i && npm run build'

        archiveArtifacts artifacts: 'ui/build/**', fingerprint: true
    }
}