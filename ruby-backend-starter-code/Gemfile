source 'https://rubygems.org'
ruby '2.3.0'

gem 'rails', '4.2.5'                          # MVC framework vs. sinatra which is a routing framework

# environment gems (front & backend, admin, db, etc.)
gem 'pg', '~> 0.18.4'                         # Postgres db instead of sqlite
# gem 'puma', '2.11.1'                          # Puma server - recommended for hosting on heroku
gem 'unicorn'                                 # Unicorn - backup server for heroku
# gem 'sinatra'                               # Framework for small apps and apis vs. Rails MVC framework

# javascript gems
gem 'jquery-rails', '~> 4.0.5'                # This gem provides jQuery and the jQuery-ujs driver for your Rails 4+ application.
gem 'jquery-ui-rails', '~> 5.0'               # jQuery UI's JavaScript, CSS, and image files packaged for the Rails 3.1+ asset pipeline
gem 'jbuilder', '~> 2.4.0'                    # Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'uglifier', '>= 2.5'                      # minify javascript assets

# look and feel (doc uploads, image views, etc.)
gem 'font-awesome-rails', '~> 4.5.0.0'        # required for font-awesome icons
gem 'sass-rails', '~> 5.0.2'                  # use scss for stylesheets vs. css
gem 'turbolinks', '2.3.0'                     # Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks
gem 'bootstrap-sass', '3.2.0.0'               # Bootstrap for rails scss (vs. rails less)

group :development, :test do
	gem 'byebug'	                              # Call 'debugger' anywhere in the code to stop execution and get a debugger console
end

group :test do
	gem 'minitest-reporters', '1.0.5'
	gem 'mini_backtrace', '0.1.3'
	gem 'guard-minitest', '2.3.1'
end

group :production do
	gem 'rails_12factor', '0.0.2'

end