# 1. Gunakan Python versi 3.9
FROM python:3.9

# 2. Setup folder kerja di dalam server
WORKDIR /code

# 3. Install library sistem yang wajib untuk OpenCV & YOLO
RUN apt-get update && apt-get install -y libgl1-mesa-glx

# 4. Copy requirements dan install library Python
COPY requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# 5. Copy semua file backend ke dalam server
COPY . .

# 6. Atur izin akses (Penting untuk Hugging Face)
RUN chmod -R 777 /code

# 7. Buka Port 7860 (Port wajib Hugging Face)
EXPOSE 7860

# 8. Jalankan aplikasi dengan Gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:7860", "app:app"]