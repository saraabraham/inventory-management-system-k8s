# Use the official .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the csproj file first to leverage Docker's layer caching
COPY OrderService/OrderService.csproj ./OrderService/
# Restore dependencies for only the csproj file to cache the NuGet packages
RUN dotnet restore "./OrderService/OrderService.csproj"

# Copy the rest of the application code
COPY . .

# Set the working directory to the project folder for the rest of the commands
WORKDIR /src/OrderService

# Publish the app
RUN dotnet publish "OrderService.csproj" -c Release -o /app/publish

# Use the official .NET ASP.NET runtime image to run the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expose the port defined in appsettings.json and config-repo
EXPOSE 8082

ENTRYPOINT ["dotnet", "OrderService.dll"]