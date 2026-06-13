from flask import Flask, render_template, request, redirect, url_for, abort
import database
from datetime import datetime

app = Flask(__name__)

database.init_db()

@app.context_processor
def inject_now():
    return {'now': datetime.utcnow()}

@app.route('/')
def index():
    return render_template('index.html', title='Flask Movie App')

@app.route('/movies')
def movies_list():
    conn = database.get_db_connection()
    movies = conn.execute('SELECT * FROM movie').fetchall()
    conn.close()
    return render_template('movie/index.html', movies=movies, title='Movies List', bodyClass='index')

@app.route('/movies/new', methods=['GET', 'POST'])
def movie_new():
    if request.method == 'POST':
        title = request.form['title']
        director = request.form['director']
        year = request.form['year']
        description = request.form['description']
        rating = request.form['rating']

        conn = database.get_db_connection()
        cursor = conn.execute(
            'INSERT INTO movie (title, director, year, description, rating) VALUES (?, ?, ?, ?, ?)',
            (title, director, year, description, rating)
        )
        movie_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return redirect(url_for('movie_show', movie_id=movie_id))
    
    return render_template('movie/new.html', movie={}, title='Create New Movie', bodyClass='edit')

@app.route('/movies/<int:movie_id>')
def movie_show(movie_id):
    conn = database.get_db_connection()
    movie = conn.execute('SELECT * FROM movie WHERE id = ?', (movie_id,)).fetchone()
    conn.close()
    if movie is None:
        abort(404)
    return render_template('movie/show.html', movie=movie, title=movie['title'], bodyClass='show')

@app.route('/movies/<int:movie_id>/edit', methods=['GET', 'POST'])
def movie_edit(movie_id):
    conn = database.get_db_connection()
    movie = conn.execute('SELECT * FROM movie WHERE id = ?', (movie_id,)).fetchone()
    
    if movie is None:
        conn.close()
        abort(404)

    if request.method == 'POST':
        title = request.form['title']
        director = request.form['director']
        year = request.form['year']
        description = request.form['description']
        rating = request.form['rating']

        conn.execute(
            'UPDATE movie SET title = ?, director = ?, year = ?, description = ?, rating = ? WHERE id = ?',
            (title, director, year, description, rating, movie_id)
        )
        conn.commit()
        conn.close()
        return redirect(url_for('movie_show', movie_id=movie_id))
    
    conn.close()
    return render_template('movie/edit.html', movie=movie, title='Edit Movie', bodyClass='edit')

@app.route('/movies/<int:movie_id>/delete', methods=['POST'])
def movie_delete(movie_id):
    conn = database.get_db_connection()
    conn.execute('DELETE FROM movie WHERE id = ?', (movie_id,))
    conn.commit()
    conn.close()
    return redirect(url_for('movies_list'))

if __name__ == '__main__':
    app.run(debug=True, port=57798)
