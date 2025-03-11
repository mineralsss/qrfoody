import os
import csv

# Define paths
audio_dir = r"C:/Users/tuana/Downloads/Compressed/drive-download-20250311T084618Z-001/audio"        # Folder containing .mp3 files
transcript_dir = r"C:/Users/tuana/Downloads/Compressed/drive-download-20250311T084618Z-001/transcript"  # Folder containing .txt files
output_csv = r"C:/Users/tuana/Downloads/Compressed/drive-download-20250311T084618Z-001/csv/output.csv"  # Output CSV file

# Collect audio and transcript pairs
data = []

for filename in sorted(os.listdir(audio_dir)):
    if filename.endswith(".mp3"):
        base_name = filename.replace("_audio.mp3", "")  # Extract base name
        transcript_file = base_name + ".txt"
        transcript_path = os.path.join(transcript_dir, transcript_file)

        if os.path.exists(transcript_path):
            with open(transcript_path, "r", encoding="utf-8") as f:
                transcript = f.read().strip()

            data.append([f"audio/{filename}", transcript])  # Format for CSV
        else:
            print(f"⚠️ Warning: No transcript found for {filename}")

# Save to CSV
    with open(output_csv, "a", encoding="utf-8-sig", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["audio_path", "transcript"])  # CSV header
        writer.writerows(data)

    print(f"✅ CSV file created: {output_csv}")
