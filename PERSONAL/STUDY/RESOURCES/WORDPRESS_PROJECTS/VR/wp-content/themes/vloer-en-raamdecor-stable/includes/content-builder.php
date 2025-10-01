<?php
// function for retrieving page content (content builder)
function vr_content_builder()
{
    if (have_rows('content_builder')) {
        while (have_rows('content_builder')) {
            the_row();
            get_template_part('parts/part', get_row_layout());
        }
    }
}
