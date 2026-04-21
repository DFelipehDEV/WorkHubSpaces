const Space = require('../models/Space');
exports.create = async (req, res) => {
    try {
        const space = await Space.create(req.body);

        return res.status(201).json({ "message": "Space created", "id": space._id });
    } catch (err) {
        return res.status(400).json({ "message": err.message });
    }
}

exports.get = async (req, res) => {
    try {
        const space = await Space.findById(req.params.id).orFail(() => {
            return res.status(404).json({ message: "Couldn't find space" });
        });

        return res.status(200).json(space);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

exports.update = async (req, res) => {
    try {
        await Space.findByIdAndUpdate(req.params.id, req.body).orFail(() => {
            return res.status(404).json({ message: "Couldn't find space" });
        });

        return res.status(200).json({ message: "Success" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

exports.delete = async (req, res) => {
    try {
        await Space.findByIdAndDelete(req.params.id).orFail(() => {
            return res.status(404).json({ message: "Couldn't find space" });
        });

        return res.status(200).json({ message: "Success" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

exports.getAll = async (req, res) => {
    const page = req.query.page;
    const limit = req.query.limit;
    const name = req.query.name;
    const capacity = req.query.capacity;
    //const startDate = req.query.startDate;
    //const endDate = req.query.endDate;
    const sort = req.query.sort;

    try {
        let findQuery = {};
        let sortQuery = {};
        if (name) {
            findQuery.name = new RegExp(name, 'i');
        }

        if (capacity) {
            findQuery.capacity = capacity;
        }

        /*if (startDate) {
            findQuery.startDate = startDate;
        }

        if (endDate) {
            findQuery.endDate = endDate;
        }*/

        if (sort == "pricePerHour") {
            sortQuery.pricePerHour = 1;
        }

        if (sort == "-pricePerHour") {
            sortQuery.pricePerHour = -1;
        }

        if (sort == "capacity") {
            sortQuery.capacity = 1;
        }

        if (sort == "-capacity") {
            sortQuery.capacity = -1;
        }

        if (sort == "popularity") {
            sortQuery.popularity = 1;
        }

        if (sort == "-popularity") {
            sortQuery.popularity = -1;
        }

        if (page > 0 && limit > 0) {
            return res.status(200).json(
                await Space.find(findQuery)
                    .limit(limit)
                    .skip((page - 1) * limit)
                    .sort(sortQuery)
                    .exec()
            );
        }

        return res.status(200).json(
            await Space.find(findQuery).sort(sortQuery)
        );
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

exports.favorite = async (req, res) => {
    try {
        const space = await Space.findById(req.params.id);
        if (space.favoritedBy.includes(req.user.id))
            return res.status(400).json({ message: "This user already favorited this space" });
        space.favoritedBy.push(req.user.id);
        space.popularity++;
        space.save();
        return res.status(200).json({ message: "Success" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

exports.deFavorite = async (req, res) => {
    try {
        const space = await Space.findById(req.params.id);
        if (!space.favoritedBy.includes(req.user.id))
            return res.status(400).json({ message: "This user didn't favorite this space" });

        var index = space.favoritedBy.indexOf(req.user.id);
        if (index !== -1) {
            space.favoritedBy.splice(index, 1);
            space.popularity--;
            space.save();
        }

        return res.status(200).json({ message: "Success" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

exports.addReview = async (req, res) => {
    try {
        const space = await Space.findById(req.params.id).orFail(() => {
            return res.status(404).json({ message: "Couldn't find space" });
        });
        space.reviews.push({
            user: req.user.id,
            review: req.body.review,
            rating: req.body.rating
        });
        await space.save();
        return res.status(200).json({ message: "Success" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}