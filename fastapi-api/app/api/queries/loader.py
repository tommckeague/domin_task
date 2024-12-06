from ruamel.yaml import YAML
from pathlib import Path

class SingletonMeta(type):
    _instance = None
    def __call__(self, *args, **kwargs):
        if self._instance is None:
            self._instance = super().__call__(*args, **kwargs)
        return self._instance

class QueryConfig(metaclass=SingletonMeta):
    def __init__(self, config_file='/app/api/queries/queries.yml'):
        yaml = YAML(typ='safe')
        self.properties = yaml.load(Path(config_file))