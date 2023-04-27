# ggbot2 DevOps

## Setup

Open _Identity and Access Management (IAM)_ on AWS Console.

Create devops user:

1. Create a user named _ggbot2-devops_.
2. Choose _Access key - Programmatic access_.
3. Copy _Access key ID_ and _Secret access key_, to be used for devops tasks.

Create devops policy:

1. Launch command `npm run task:showDevopsPolicy`. Copy the output of the command and put in the create policy's JSON editor.
1. Create a policy named _ggbot2-devops-policy_, add a description: _manage ggbot2 devops automations_

Create devops user group:

1. Create a group named _ggbot2-devops-group_.
2. Add _ggbot2-devops_ user to group.
3. Attach _ggbot2-devops-policy_ policy to group.
