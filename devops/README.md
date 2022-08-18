# ggbot2 DevOps

## Setup

Open *Identity and Access Management (IAM)* on AWS Console.

Create devops user:

1. Create a user named *ggbot2-devops*.
2. Choose *Access key - Programmatic access*.
3. Copy *Access key ID* and *Secret access key*, to be used for devops tasks.

Create devops policy:

1. Launch command `npm run task:showDevopsPolicy`. Copy the output of the command and put in the create policy's JSON editor.
1. Create a policy named *ggbot2-devops-policy*, add a description: *manage ggbot2 devops automations*

Create devops user group:

1. Create a group named *ggbot2-devops-group*.
2. Add *ggbot2-devops* user to group.
3. Attach *ggbot2-devops-policy*  policy to group.
