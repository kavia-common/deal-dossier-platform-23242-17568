#!/bin/bash
cd /home/kavia/workspace/code-generation/deal-dossier-platform-23242-17568/deal_dossier_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

