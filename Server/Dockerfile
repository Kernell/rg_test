FROM mcr.microsoft.com/dotnet/aspnet:6.0-bullseye-slim AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0-alpine AS build
ARG BUILD_CONF
ENV BUILD_CONF ${BUILD_CONF:-debug}
WORKDIR /src
COPY . .
RUN dotnet build "Server.csproj" -c $BUILD_CONF -r ubuntu-x64 -o /app/build

FROM build AS publish
RUN dotnet publish "Server.csproj" -c $BUILD_CONF -r ubuntu-x64 -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "/app/Server.dll"]
