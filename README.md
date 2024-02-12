# Avaliação ReactJS

Este é um guia para instalação e execução do projeto.

## Pré-requisitos

Antes de começar, certifique-se de ter o Node.js instalado em sua máquina. Você pode instalá-lo em [https://nodejs.org/](https://nodejs.org/).

## Instalação e Execução da API

Para iniciar, instale o `json-server` globalmente usando o seguinte comando:

```
npm install -g json-server
```

Depois, navegue até a pasta 
    
    database/

e execute o seguinte comando para iniciar o json-server:

```
json-server --watch products.json --port 3001
```
Este comando iniciará um servidor JSON local na porta 3001 usando o arquivo products.json como banco de dados simulado.


## Instalação e Execução da Aplicação Frontend
Agora, para instalar as dependências da aplicação, navegue até a pasta do projeto e execute um dos seguintes comandos, dependendo do gerenciador de pacotes de sua escolha:

```
yarn install | npm install
```

Após a conclusão da instalação, execute o seguinte comando para iniciar a aplicação:


```
yarn start | npm run start
```

Este comando iniciará a aplicação e você poderá acessá-la em http://localhost:3000 no seu navegador.