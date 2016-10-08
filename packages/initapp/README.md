# Install
```
npm install -g initapp
```
# Help
```
iapp -h
```

# Usage
Assume have this folders:
```
/
/space
```
### Initialize a project
when `cwd=/space`
```
iapp init myapp -p=config-relay-react
```
will get a new project `/space/myapp`

--------------------------------------------------

### Update a exist project to new config.
when `cwd=/space`
```
iapp update myproject -p=config-relay-react
```
will update project `/space/myapp` to new config.<br/>

when `cwd=/space/myapp`, the project can be updated with
```
iapp update ./ -p=config-relay-react
```

--------------------------------------------------
