# Password-Checker-Generator-Automation
Using n8n to take in inputs for passwords that can be used to check if password is complex enough and generate stronger passwords. This automation should be able to multiple inputs.
This automation will take place with the start of webhook which listens for a message which can be sent manually or through an application like "PostMan". This would trigger the webhook and then proceed to send the analysis back.
This can furhtur be used more nefariously by adding a discord node that sends this passwrod and the complexity to channel used by the creator which would allow him or anyone on the channel to see the passwords as well.


The automation was made with the use of n8n, proceeding to use this workflow can lead to the the workflow being active even when the system is shut down. This also uses a webhook server to recieve the message and post results which can
be used for free.

