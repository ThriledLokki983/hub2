<?php get_header(); ?>

    <main class="main details">
        <section class="item">
            <div class="item__content">
                <article class="item__content__left">
                    <picture class="item__content__left--main-image">
                        <svg class="icon left">
                            <use
                                xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-chevron-left"
                            ></use>
                        </svg>
                        <img src="<?= TPL_DIR_URI ?>/public/assets/img/featured-photo.png" alt="logo" id="logo"  class="main-image" />
                        <svg class="icon right">
                            <use
                                xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-chevron-right"
                            ></use>
                        </svg>
                    </picture>
                    <div class="item__content__left--related-images">
                        <ul class="related__image--lists">
                            <svg class="icon go-previous">
                                <use
                                    xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-chevron-left"
                                ></use>
                            </svg>
                            <li
                                class="related__image--lists-item active-image"
                                data-active="true"
                            >
                                <img src="<?= TPL_DIR_URI ?>/public/assets/img/related-photo-1.png" alt="" />
                            </li>
                            <li class="related__image--lists-item" data-active="false">
                                <img src="<?= TPL_DIR_URI ?>/public/assets/img/related-photo-2.png" alt="" />
                            </li>
                            <li class="related__image--lists-item" data-active="false">
                                <img src="<?= TPL_DIR_URI ?>/public/assets/img/related-photo-3.png" alt="" />
                            </li>
                            <svg class="icon go-next">
                                <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-chevron-right"></use>
                            </svg>
                        </ul>
                    </div>
                </article>
                <article class="item__content__right">
                    <div class="item__header">
                        <div class="product-card-title-primary">
                            <span class="product-text">MODULEO SELECT VLOER</span>
                            <h2 class="product-text">Brio Oak 22237</h2>

                            <div class="faded-price">
                                <span>van</span>
                                <h2
                                >€ 61,50 <span>m<sup>2</sup></span></h2
                                >
                            </div>
                        </div>
                        <div class="deal--box">
                            <h2 class="title">All-in <span>Deal</span></h2>
                        </div>
                    </div>
                    <div class="item__info">
                        <div class="product-card-title-primary">
                            <span class="product-text">ALL IN DEAL</span>
                            <h2 class="product-text">€ 49,20<span class="metre">m<sup>2</sup></span></h2>
                            <div class="other__colors">
                                <h4>Andere kleuren</h4>
                                <ul class="other__colors--lists">
                                    <li class="other__colors--lists-item active-color">
                                        <span data-color-choice=""></span>
                                    </li>
                                    <li class="other__colors--lists-item">
                                        <span data-color-choice=""></span>
                                    </li>
                                    <li class="other__colors--lists-item">
                                        <span data-color-choice=""></span>
                                    </li>
                                    <li class="other__colors--lists-item">
                                        <span data-color-choice=""></span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="price__include">
                            <h4>Deze prijs is inclusief: </h4>
                            <ul class="price__include--lists">
                                <li class="price__include--lists--item">Inmeten</li>
                                <li class="price__include--lists--item">Egaliseren</li>
                                <li class="price__include--lists--item">Leggen van de vloer</li
                                >
                                <li class="price__include--lists--item">
                                    <svg class="icon">
                                        <use
                                            xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-chevron-right"
                                        ></use>
                                    </svg>
                                    <a href="#">Meer over de All-in Deal</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <details class="more__info space-borders">
                        <summary>
                            <h4>Meer product specificaties</h4>
                            <svg class="icon">
                                <use
                                    xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-chevron-down"
                                ></use>
                            </svg>
                        </summary>
                        <p class="small-text">
                            Vloeren & raamdecor.nl is een specialist in complete woninginrichting. Wij leveren tevens vloerverwarming in combinatie met een nieuwe vloer. Geen gedoe met verschillende partijen en niet op elkaar aansluitende planningen. Maar gewoon één aanspreekpunt voor het gehele project.
                    </details>

                    <div class="calculate__price">
                        <div class="product-card-title-primary">
                            <span class="product-text">MAAK HET JEZELF MAKKELIJK</span>
                            <h2 class="product-text">BEREKEN JE PRIJS</h2>
                        </div>
                        <div class="calculate__price--content">
                            <div class="form__container">
                                <div class="form__group">
                                    <label for="m-square"
                                    >Hoeveel <span>m<sup>2</sup></span> heb je nodig?</label
                                    >
                                    <input
                                        type="text"
                                        id="m-square"
                                        class="m-square"
                                        placeholder="56.40 m&sup2;"
                                    />
                                </div>
                                <div class="form__group">
                                    <label for="m-square">Aantal pakketten?</label>
                                    <input
                                        type="text"
                                        id="m-square"
                                        class="m-square"
                                        placeholder="15"
                                    />
                                </div>
                                <div class="product-card-title-primary">
                                    <span class="product-text">compleet prijs</span>
                                    <h2 class="product-text">€ 2.774,88</h2>
                                </div>
                            </div>
                            <div class="right">
                                <div class="product-card-title-primary">
                                    <span class="product-text">AUTOMATISCHE BEREKEND</span>
                                </div>
                                <p class="paragraph"
                                >Je hebt aangegeven
                                    <span class="bold">15 pakken</span> nodig te zijn. Dit is
                                    voldoende voor
                                    <span class="bold">56.40 m<sup>2</sup></span> We houden
                                    daarbij rekening met 10% snijverlies.</p
                                >
                            </div>
                        </div>
                        <?php
                        $product = wc_get_product(get_the_ID());
                        ?>
                        <a href="<?php echo $product->add_to_cart_url() ;?>" class="btn primary">
                            <svg class="icon">
                                <use
                                        xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-chevron-right"
                                ></use>
                            </svg>
                            bereken je prijs & vraag een offerte aan</a
                        >

                    </div>
                </article>
            </div>
            <!-- The Modal -->
            <div id="myModal" class="modal">
                <!-- <svg class="icon go-back">
                                <use
                                    xlink:href="assets/icons/sprite.svg#icon-chevron-left"
                                ></use>
                            </svg> -->
                <img class="modal-content" id="img01">
                <!-- <svg class="icon go-next">
                                <use
                                    xlink:href="assets/icons/sprite.svg#icon-chevron-right"
                                ></use>
                            </svg> -->
            </div>
        </section>

        <section class="modulo__installation details">
            <article class="left">
                <div class="product-card-title-primary">
                    <span class="product-text">MODULEO SELECT VLOER</span>
                    <h2 class="product-text">compleet geïnstalleerd</h2>
                </div>
                <ul class="lists">
                    <li class="lists-item">
                        <svg class="icon">
                            <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-check"></use>
                        </svg>
                        <span>Gratis inmeten & advies aan huis</span>
                    </li>
                    <li class="lists-item">
                        <svg class="icon">
                            <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-check"></use>
                        </svg>
                        <span>Voorbereiden van de zandcement dekvloer </span>
                    </li>
                    <li class="lists-item">
                        <svg class="icon">
                            <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-check"></use>
                        </svg>
                        <span>Aanbrengen van Eurocol hechtprimer </span>
                    </li>
                    <li class="lists-item">
                        <svg class="icon">
                            <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-check"></use>
                        </svg>
                        <span>Aanbrengen van 3 mm Eurocol egalisatie </span>
                    </li>
                    <li class="lists-item">
                        <svg class="icon">
                            <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-check"></use>
                        </svg>
                        <span>Schuren en voorbereiden geëgaliseerde vloer </span>
                    </li>
                    <li class="lists-item">
                        <svg class="icon">
                            <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-check"></use>
                        </svg>
                        <span>Verlijmd van de PVC vloer met watervaste PVC lijm </span>
                    </li>
                    <li class="lists-item">
                        <svg class="icon">
                            <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-check"></use>
                        </svg>
                        <span>10 Jaar garantie op de installatie </span>
                    </li>
                    <li class="lists-item">
                        <svg class="icon">
                            <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-check"></use>
                        </svg>
                        <span>Normale prijs € 67,45 m² </span>
                    </li>
                </ul>
            </article>

            <article class="right">
                <div class="product-card-title-primary">
						<span class="product-text"
                        >ruime keuze aan hout- en steeneffecten</span
                        >
                    <h2 class="product-text">MODULEO SELECT COLLECTIE</h2>
                </div>

                <p class="paragraph"
                >Het Select PVC vloeren assortiment van Moduleo biedt een ruime
                    keuze aan hout- en steeneffecten, die je toelaten om een unieke
                    ruimte te creëren. De Moduleo Select vloeren zijn makkelijk schoon
                    te maken en slijtvast door de vlekbestendige Protectonite-laag. De
                    Moduleo Select PVC vloeren zijn in zowel plak -als click versie te
                    leveren. Maar Select vloeren zijn ook geluiddempend,
                    warmte-isolerend en vochtwerend. Daarom zijn ze ook een goede keuze
                    voor badkamers.
                </p>

                <ul class="lists">
                    <li class="lists-item">
								<span>2.35 mm dik met 0.40 mm toplaag met Protectonite®
								afwerking.</span>
                    </li>

                    </li>
                    <li class="lists-item">
							<span
                            >Select planken 19,6 x 132 cm.</span
                            >
                    </li>

                    </li>
                    <li class="lists-item"><span
                        >Rondom een V-groef.</span
                        ></li>

                    </li>
                    <li class="lists-item"><span
                        >Voelbare houtnerf structuur.
							</span
                            ></li>

                    </li>
                    <li class="lists-item"><span
                        > Geschikt voor zwaar woongebruik en projectgebruik.
							</span
                            ></li>

                    </li>
                    <li class="lists-item"><span
                        > 15 jaar garantie op slijtage.
							</span
                            ></li>

                    </li>
                </ul>
            </article>
        </section>

        <section class="services container--small">
            <ul class="services__lists">
                <li class="services__lists--item">
                    <svg class="icon">
                        <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-bags"></use></svg><a href="#" class="services__lists--item-link"> Top merken</a></li
                >
                <li class="services__lists--item">
                    <svg class="icon">
                        <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-handshake"></use>
                    </svg>
                    <a href="#" class="services__lists--item-link">
                        All-in-service</a
                    ></li
                >
                <li class="services__lists--item">
                    <svg class="icon">
                        <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-medal"></use>
                    </svg>
                    <a href="#" class="services__lists--item-link">
                        Uitgebreide garantie</a
                    ></li
                >
                <li class="services__lists--item">
                    <svg class="icon">
                        <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-eye"></use>
                    </svg>
                    <a href="#" class="services__lists--item-link">
                        Eigen showroom</a
                    ></li
                >
                <li class="services__lists--item">
                    <svg class="icon">
                        <use
                            xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-clipboard-checklist"
                        ></use>
                    </svg>
                    <a href="#" class="services__lists--item-link">
                        Compleet advies</a
                    ></li
                >
            </ul>
        </section>

        <section class="support container--full">
            <article class="support__content">
                <ul class="support__content--list">
                    <li class="support__content--list-item">
                        <figure>
                            <img src="<?= TPL_DIR_URI ?>/public/assets/img/support-1.png" alt="" loading="lazy" />
                        </figure>
                    </li>
                    <li class="support__content--list-item">
                        <figure>
                            <img src="<?= TPL_DIR_URI ?>/public/assets/img/support-3.png" alt="" loading="lazy" />
                        </figure>
                    </li>
                    <li class="support__content--list-item">
                        <figure>
                            <img src="<?= TPL_DIR_URI ?>/public/assets/img/support-2.png" alt="" loading="lazy" />
                        </figure>
                    </li>
                    <li class="support__content--list-item">
                        <figure>
                            <img src="<?= TPL_DIR_URI ?>/public/assets/img/support-4.png" alt="" loading="lazy" />
                        </figure>
                    </li>
                    <li class="support__content--list-item">
                        <figure>
                            <img src="<?= TPL_DIR_URI ?>/public/assets/img/support-5.png" alt="" loading="lazy" />
                        </figure>
                    </li>
                </ul>
            </article>
        </section>
    </main>

<?php get_footer(); ?>