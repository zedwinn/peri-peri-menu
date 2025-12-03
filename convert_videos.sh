#!/bin/bash
# Convert MOV files to MP4 using ffmpeg

cd "$(dirname "$0")/images"

# Check if ffmpeg is available
if ! command -v ffmpeg &> /dev/null; then
    echo "ffmpeg not found. Installing via Homebrew..."
    if command -v brew &> /dev/null; then
        brew install ffmpeg
    else
        echo "Error: Homebrew not found. Please install ffmpeg manually."
        echo "Visit: https://ffmpeg.org/download.html"
        exit 1
    fi
fi

echo "Converting videos to MP4..."

# Convert each video
for file in *_demo.mov; do
    if [ -f "$file" ]; then
        output="${file%.mov}.mp4"
        echo "Converting $file to $output..."
        ffmpeg -i "$file" -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k "$output" -y
        echo "✓ Converted $output"
    fi
done

echo "All videos converted!"
