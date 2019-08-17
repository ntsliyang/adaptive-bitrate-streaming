import os

VIDEO_PATH = '../video_server_bbb_30fps'

# assume videos are in ../video_servers/video[1, 2, 3, 4, 5]
# the quality at video5 is the lowest and video1 is the highest

# sizes = []
for idx, dir in enumerate(os.listdir(VIDEO_PATH)):
    size = []
    for bitrate in os.listdir(os.path.join(VIDEO_PATH, dir)):
        video_chunk_path = os.path.join(VIDEO_PATH, dir, bitrate)
        chunk_size = os.path.getsize(video_chunk_path)
        size.append(chunk_size)
    # sizes.append(size)
    print (dir)
    print (size)
    print ('\n')

# print(sizes)
