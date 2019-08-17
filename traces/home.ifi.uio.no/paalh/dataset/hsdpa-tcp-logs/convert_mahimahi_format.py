import os

TRACE_FOLDER = '.'
OUTPUT_FOLDER = './mahimahi_format_logs'
BITS_IN_BYTES = 8.0
B_IN_MB = 1e6

if os.path.exists(OUTPUT_FOLDER) == False:
    os.makedirs(OUTPUT_FOLDER)

def main():
    for dir in os.listdir(TRACE_FOLDER):
        # print(dir)
        if dir == 'mahimahi_format_logs' or os.path.isdir(dir) == False:
            continue
        current_output_folder = os.path.join(OUTPUT_FOLDER, dir)
        os.mkdir(current_output_folder)
        for trace in os.listdir(os.path.join(TRACE_FOLDER, dir)):
            trace_filepath = os.path.join(TRACE_FOLDER, dir, trace)
            if os.path.splitext(trace_filepath)[-1].lower() != '.log':
                continue
            output_filepath = os.path.join(current_output_folder, trace)
            with open(trace_filepath, 'r') as f, open(output_filepath, 'w') as wf:
                # print ('here')
                time_elapsed = 0
                for line in f:
                    parse = line.split()
                    time_diff = float(parse[-1]) / 1000.0
                    time_elapsed += time_diff
                    bytes_transferred = float(parse[-2])
                    throughput = (bytes_transferred * BITS_IN_BYTES / B_IN_MB) / time_diff
                    wf.write(str(round(time_elapsed, 2)) + " " + str(round(throughput, 11)) + "\n")
                # wf.flush()

if __name__ == '__main__':
	main()
