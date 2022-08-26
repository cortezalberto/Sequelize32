const { Movie } = require("../database/models");
const { Op } = require("sequelize");

const moment = require("moment");

const formatDate = (fecha) => {
    return moment(fecha).format('YYYY-MM-DD');
}

const moviesController = {

    list: async (req, res) => {
        try {
            const movies = await Movie.findAll();
            return res.render("moviesList", { movies })
        } catch (error) {
            res.json(error.message)
        }
    },


    new: async (req, res) => {
        try {
            const movies = await Movie.findAll({
                order: [["release_date", "DESC"]],
                limit: 5
            });
            return res.render("newestMovies", { movies })
        } catch (error) {
            res.json(error.message)
        }           
    },


    recommended: async (req, res) => {
        try {
            const movies = await Movie.findAll({
                where: {
                    rating: {
                        [Op.gte]: 8
                    }
                },
                order: [["rating", "DESC"]],
                limit: 10
            });
            return res.render("recommendedMovies", { movies })
        } catch (error) {
            res.json(error.message)
        }  
    },


    detail: async (req, res) => {
        try {
            const { id } = req.params
            const movie = await Movie.findByPk(id);
            return res.render("moviesDetail", { movie })
        } catch (error) {
            res.json(error.message)
        }
    },

    //Aquí debemos modificar y completar lo necesario para trabajar con el CRUD

    add: (req, res) => { 
        return res.render("moviesAdd")
    },


    create: async (req, res) => { 
        try {
            const { body } = req;
            const {id} = await Movie.create({
                ...body
            });
            return res.redirect(`/movies/detail/${id}`)
        } catch (error) {
            res.json(error.message)
        }
    },


    edit: async (req, res) => { 
        try {
            const { id } = req.params
            const movie = await Movie.findByPk(id);
            return res.render("moviesEdit", { 
                movie,
                date: formatDate(movie.release_date) 
            })
        } catch (error) {
            res.json(error.message)
        }
    },


    update: async (req, res) => { 
        try {
            const { body } = req;
            const { id } = req.params;
            const movie = await Movie.update({
                ...body
            }, {
                where: {
                    id: id
                }
            });
            return res.redirect(`/movies/detail/${id}`)
        } catch (error) {
            res.json(error.message)
        }
    },


    delete: async (req, res) => { 
        try {
            const { id } = req.params;
            const movie = await Movie.findByPk(id);
            return res.render(`moviesDelete`, { movie })
        } catch (error) {
            res.json(error.message)
        }
    },


    destroy: async (req, res) => { 
        try {
            const { id } = req.params;
            await Movie.destroy({
                where: {
                    id
                }
            }, {
                force: true
            });
            return res.redirect("/movies")
        } catch (error) {
            res.json(error.message)
        }
    }
};

module.exports = moviesController;
