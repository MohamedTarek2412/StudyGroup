#!/bin/bash
dotnet tool install --global dotnet-ef --version 8.0.0
export PATH="$PATH:/root/.dotnet/tools"
dotnet ef migrations add AddMaterialDownloadCount
