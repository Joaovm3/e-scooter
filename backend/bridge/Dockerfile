FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
# CMD ["python", "bridge.py"]

#
# This wait-for-it.sh is needed to await kafka to stay healthy
# https://github.com/vishnubob/wait-for-it
#
RUN chmod +x wait-for-it.sh
CMD ["./wait-for-it.sh", "-t", "0", "kafka:9092", "--", "python", "bridge.py"]
