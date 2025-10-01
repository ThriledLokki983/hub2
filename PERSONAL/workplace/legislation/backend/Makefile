DB_HOST ?= mysql
CODE_DIR ?= src

pycodestyle:
	pip install pycodestyle==2.4.0
	pycodestyle --config=conf/setup.cfg $(CODE_DIR)

migrate:
	python src/manage.py migrate

migrate-local:
	wait-for-it.sh -t 300 $(DB_HOST):3306 && python src/manage.py migrate

collect-static:
	python src/manage.py collectstatic --noinput

background-runner:
	while true; do \
		python $(CODE_DIR)/manage.py run_tasks; \
		sleep 10; \
	done;

test-lint:
	pip install pylint-django==2.5.3
	PYTHONPATH=$(CODE_DIR) pylint --load-plugins pylint_django --rcfile=conf/.pylintrc $(CODE_DIR)

run-dev: migrate-local pycodestyle test-lint
	python src/manage.py runserver 0.0.0.0:8000

run-dev-native: migrate
	python src/manage.py runserver 0.0.0.0:8000

run: collect-static
	# uwsgi --http 0.0.0.0:8000 --chdir src --module core.wsgi:application --master
	uwsgi conf/uwsgi.ini
