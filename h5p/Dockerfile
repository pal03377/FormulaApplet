# inspired by https://github.com/sr258/drupal-h5p-docker/blob/master/Dockerfile
FROM drupal:7

COPY ./uploads.ini /usr/local/etc/php/conf.d/uploads.ini
RUN mkdir -p /var/www/html/sites/default/files && \
    chmod a+w /var/www/html/sites/default -R

RUN apt-get update && apt-get install -y wget sudo sqlite3 curl
RUN wget https://github.com/drush-ops/drush/releases/download/8.4.8/drush.phar
RUN chmod +x drush.phar
RUN mv drush.phar /usr/local/bin/drush
WORKDIR /var/www/html
RUN sudo -u www-data drush -y site-install --db-url=sqlite://sites/h5pdev/files/.ht.sqlite --account-pass=admin
RUN sudo -u www-data drush -y dl h5p
RUN sudo -u www-data drush -y en h5p
RUN sudo -u www-data drush -y en h5peditor