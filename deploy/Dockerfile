# 私有化部署：以非 root 用户运行的 nginx，只包含页面运行所需的文件
# 构建：docker build -f deploy/Dockerfile -t agent-baseline-assessor .
# 运行：docker run -d -p 8080:8080 --read-only --tmpfs /tmp agent-baseline-assessor
FROM nginxinc/nginx-unprivileged:1.28-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
COPY assets /usr/share/nginx/html/assets
COPY data /usr/share/nginx/html/data
COPY vendor /usr/share/nginx/html/vendor
COPY offline /usr/share/nginx/html/offline
EXPOSE 8080
