# Use the official .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the csproj file first to leverage Docker's layer caching
# This copies the project file from the build context (which is the solution root)
COPY ProductService/ProductService.csproj ./ProductService/
# Restore dependencies for only the csproj file to cache the NuGet packages
RUN dotnet restore "./ProductService/ProductService.csproj"

# Copy the rest of the application code
COPY . .

# Set the working directory to the project folder for the rest of the commands
WORKDIR /src/ProductService

# Publish the app
RUN dotnet publish "ProductService.csproj" -c Release -o /app/publish

# Use the official .NET ASP.NET runtime image to run the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expose the port defined in appsettings.json and config-repo
EXPOSE 8081

ENTRYPOINT ["dotnet", "ProductService.dll"]