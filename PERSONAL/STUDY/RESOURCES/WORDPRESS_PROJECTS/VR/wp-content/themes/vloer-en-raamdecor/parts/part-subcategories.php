  <?php $items = get_sub_field('categorie'); ?>
  <section class="categories__hero">
      <div class="categories__hero--collection">
          <ul class="collection__lists">
              <?php foreach ($items as $item) : ?>
              <li class="collection__lists-item">
                  <a href="<?= $item['link'] ?>"
                      class="collection__lists-item-link">
                      <picture class="collection__lists-item-link--img">

                          <?php

        $img = $item['afbeelding'];
        $src = $img['url'];
        $alt = getAcfImageAlt($img);
        ?>
                          <source media="(max-width: 767px)"
                              srcset="<?= $src ?>" />
                          <source media="(min-width: 768px)"
                              srcset="<?= $src ?>" />
                          <img class="a-r-8" src="<?= $src ?>" alt="<?= $alt ?>"
                              loading="lazy" />
                          <button
                              class="btn primary"><?= $item['titel'] ?></button>

                      </picture>
                  </a>
              </li>
              <?php endforeach; ?>
          </ul>
      </div>
  </section>
