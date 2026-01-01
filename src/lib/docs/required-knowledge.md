# Required knowledge

Before starting the installation and configuration of the EML ecosystem, some technical foundations are required. EML is not a "plug-and-play" solution, but a suite of tools for developers and server administrators.

You should be comfortable with the following concepts:

* **System Administration (Linux):** You will need to manage a VPS (Virtual Private Server), navigate the command line, manage file permissions, and install software.
* **Docker & Docker Compose:** The EML AdminTool is designed to run in Docker containers. You must understand what Docker is, how to install it, and how to use `docker-compose.yml` files.
* **Web Server / Reverse Proxy:** Knowledge of Nginx (recommended) or Apache is essential to securely expose the AdminTool to the internet.
* **DNS & Networking:** You must know how to configure DNS records (A, CNAME) to point your domain name to your server's IP.
* **SSL Certificates:** Understanding what SSL is and how to generate a certificate (e.g., with Let's Encrypt) is necessary for security.
* **Node.js (for the Launcher):** To create the launcher itself (Part IV), a good understanding of JavaScript/TypeScript, Node.js, and the Electron framework is mandatory.