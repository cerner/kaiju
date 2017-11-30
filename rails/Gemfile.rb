source 'https://rubygems.org'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '5.1.1'
# Use sqlite3 as the database for Active Record
gem 'sqlite3'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'

# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0', group: :doc

gem 'haml', '~> 5.0'
gem 'haml-rails', '~> 1.0'

gem 'httparty', '~> 0.15.5'

# Deep Freeze objects
gem 'ice_nine', '~> 0.11.2'

# Auth
gem 'omniauth', '~> 1.5'
gem 'omniauth-openid', '~> 1.0'

# React on Rails
gem 'mini_racer', platforms: :ruby
gem 'react_on_rails', '~> 8'
gem 'webpacker_lite'

# Redis
gem 'redis', '~> 3.3'
gem 'redis-namespace', '~> 1.5', '>= 1.5.2'
gem 'redis-objects', '~> 1.3'
gem 'redis-rails', '~> 5.0'

# Use Puma as the app server
gem 'puma', '~> 3.4'

gem 'stackprof', '~> 0.2.10'

# Rouge Syntax highlighter
gem 'rouge', '~> 2.0'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug'
  gem 'rspec-rails', '~> 3.5'
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> in views
  gem 'web-console', '~> 3.0'

  gem 'rubocop', '~> 0.49'

  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'

  gem 'pry'
  gem 'pry-byebug'
  gem 'pry-stack_explorer'

  gem 'brakeman', '~> 3.4'
  gem 'bundler-audit', '~> 0.5'
end
