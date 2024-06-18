FROM python:3.10.8-slim-bullseye
WORKDIR /app
#Copy python files
COPY ./src/ ./src
COPY ./requirements.txt ./requirements.txt

RUN apt-get update

ENV VIRTUAL_ENV=/app/venv
RUN python -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
RUN /app/venv/bin/python -m pip install --upgrade pip
RUN pip install packaging
RUN pip3 install --quiet --no-cache-dir -r requirements.txt



#execute entrypoint
ENTRYPOINT ["python3", "src/main.py"]