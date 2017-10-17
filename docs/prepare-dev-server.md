
### Shh key for bitbucket ###

ssh-keygen
ssh-agent /bin/bash
ssh-add ~/.ssh/id_rsa
cat ~/.ssh/id_rsa.pub

### Install Docker ###

sudo apt-get update

sudo apt-get install \
    linux-image-extra-$(uname -r) \
    linux-image-extra-virtual

sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

sudo apt-get update

sudo apt-get install docker-ce

sudo groupadd docker

sudo usermod -aG docker $USER

sudo systemctl enable docker

### Install Docker Compose ###

sudo curl -L "https://github.com/docker/compose/releases/download/1.11.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

### Install Node.js ###
wget https://nodejs.org/dist/v7.7.3/node-v7.7.3-linux-x64.tar.xz
sudo tar -xJf "node-v7.7.3-linux-x64.tar.xz" -C /usr/local --strip-components=1
