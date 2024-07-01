import json
import os
import shutil
import sys
import subprocess

force = '--force' in sys.argv

if not force:
    confirm = input('This script will modify your package.json file and remove the src directory.\nAre you sure you want to proceed? (Y/n): ')
    if confirm.lower() != 'y':
        print('Script execution cancelled by user.')
        sys.exit()
        
subprocess.run(['yarn', 'run', 'build'], check=True)

with open('package.json', 'r') as file:
    data = json.load(file)

data['module'] = 'dist/weka-ui-components.js'
data['types'] = 'dist/main.d.ts'

with open('package.json', 'w') as file:
    json.dump(data, file, indent=2)
    file.write('\n')

if os.path.exists('lib'):
    shutil.rmtree('lib')
