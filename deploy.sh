#!/usr/bin/env sh

ecnucs=ubuntu@192.168.10.162

echo start deploying...
echo kill backend process...
ssh ${ecnucs} "if [ -f \"/var/log/app.pid\" ]; then kill \$(cat /var/log/app.pid); fi"

echo clean resources...
ssh ${ecnucs} "rm -r /home/ubuntu/cs-platform/static/*"
ssh ${ecnucs} "cp -r /home/ubuntu/cs-platform/static-temp/* /home/ubuntu/cs-platform/static/"
scp -r ./dist/* ${ecnucs}:/home/ubuntu/cs-platform/static

echo start backend...
ssh ${ecnucs} "cd /home/ubuntu/cs-platform;nohup java -jar \$(ls *jar) > nohup.out 2> nohup.err &"

echo deployment completed
