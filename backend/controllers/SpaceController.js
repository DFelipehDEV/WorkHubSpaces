const Space = require('../models/Space');
const Reservation = require('../models/Reservation');
exports.create = async (req, res) => {
    try {
        const space = await Space.create({
            name: req.body.name,
            type: req.body.type,
            available: req.body.available,
            description: req.body.description,
            capacity: req.body.capacity,
            pricePerHour: req.body.pricePerHour,
            images: req.body.images,
        });

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
        await Space.findById(req.params.id).orFail(() => {
            return res.status(404).json({ message: "Couldn't find space" });
        }).updateOne({
            name: req.body.name,
            type: req.body.type,
            available: req.body.available,
            description: req.body.description,
            capacity: req.body.capacity,
            pricePerHour: req.body.pricePerHour,
            images: req.body.images,
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
    try {
        const { page = 1, limit = 0, name, capacity, startDate, endDate, sortBy, order = 'asc' } = req.query;
        let dbQuery = Space.find();
        
        if (name) {
            const nameRegex = new RegExp(name, 'i');
            dbQuery = dbQuery.or([
                { name: nameRegex },
                { type: nameRegex },
                { description: nameRegex }
            ]);
        }
        
        if (capacity) {
            dbQuery = dbQuery.where('capacity').gte(Number(capacity));
        }
        
        if (startDate && endDate) {
            const conflictingReservations = await Reservation.find()
                .where('status').in([0, 2])
                .where('startDate').lt(new Date(endDate))
                .where('endDate').gt(new Date(startDate));

            const conflictingSpaceIds = conflictingReservations.map(r => r.spaceId);
            dbQuery = dbQuery.where('_id').nin(conflictingSpaceIds);
        }
        
        const sortOrder = order === 'desc' ? -1 : 1;
        if (sortBy === 'price') dbQuery = dbQuery.sort({ pricePerHour: sortOrder });
        if (sortBy === 'capacity') dbQuery = dbQuery.sort({ capacity: sortOrder });

        let result = await dbQuery.exec();

        if (sortBy === 'popularity') {
            result.sort((a, b) => {
                const aPop = a.favoritedBy ? a.favoritedBy.length : 0;
                const bPop = b.favoritedBy ? b.favoritedBy.length : 0;
                return sortOrder === 1 ? aPop - bPop : bPop - aPop;
            });
        }

        if (Number(limit) > 0) {
            const startIndex = (Number(page) - 1) * Number(limit);
            result = result.slice(startIndex, startIndex + Number(limit));
        }
        
        return res.status(200).json(result);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
} 