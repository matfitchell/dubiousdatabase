from setuptools import setup
setup(
   name='dubiousdb',
   version='0.1',
   packages=['dubiousdb'],
   install_requires=['flask', 'mysql-connector-python'],
   scripts=[
            'scripts/cool',
            'scripts/skype',
           ]
)