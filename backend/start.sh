#!/bin/bash

set -e

echo "Running migrations..."
php artisan migrate --force

echo "Generating Passport keys..."
php artisan passport:keys --force

echo "Creating Passport personal access client..."
php artisan passport:client --personal --no-interaction

echo "Caching configuration..."
php artisan config:cache
php artisan route:cache

echo "Starting PHP-FPM..."
exec php-fpm