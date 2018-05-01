import yaml
import sys

compose = dict()

with open('base-compose.yml') as infile:
	compose = yaml.safe_load(infile)
	try:
		print sys.argv[1]
		compose["services"]["web"]["image"] = sys.argv[1]
		print compose
	except IndexError:
		print "Image name not specified"

with open('docker-compose.yml', 'w') as outfile:
	yaml.dump(compose, outfile, default_flow_style=False)
