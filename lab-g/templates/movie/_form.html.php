<?php
    /** @var $movie ?\App\Model\Movie */
?>

<div class="form-group">
    <label for="title">Title</label>
    <input type="text" id="title" name="movie[title]" value="<?= $movie ? $movie->getTitle() : '' ?>">
</div>

<div class="form-group">
    <label for="director">Director</label>
    <input type="text" id="director" name="movie[director]" value="<?= $movie ? $movie->getDirector() : '' ?>">
</div>

<div class="form-group">
    <label for="year">Year</label>
    <input type="number" id="year" name="movie[year]" value="<?= $movie ? $movie->getYear() : '' ?>">
</div>

<div class="form-group">
    <label for="description">Description</label>
    <textarea id="description" name="movie[description]"><?= $movie ? $movie->getDescription() : '' ?></textarea>
</div>

<div class="form-group">
    <label for="rating">Rating</label>
    <input type="number" id="rating" name="movie[rating]" min="1" max="5" value="<?= $movie ? $movie->getRating() : '' ?>">
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
