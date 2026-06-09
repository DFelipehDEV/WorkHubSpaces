const Reservation = require('../models/Reservation');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Space = require('../models/Space');
const SpaceType = require('../models/SpaceType');

exports.create = async (req, res) => {
  try {
    const { spaceId, startDate, endDate } = req.body;

    const overlappingReservations = await Reservation.find({
      spaceId: spaceId,
      status: { $ne: Reservation.ReservationStatuses.Cancelled },
      startDate: { $lt: endDate },
      endDate: { $gt: startDate }
    });

    if (overlappingReservations.length > 0) {
      return res.status(409).json({ message: "This space is already booked for the selected dates." });
    }

    const reservation = await Reservation.create({
      reservedBy: req.user.id,
      spaceId: req.body.spaceId,
      active: req.body.active,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      status: Reservation.ReservationStatuses.Pending,
      obs: req.body.obs,
      internalObs: "",
      extraServices: req.body.extraServices,
      cost: req.body.cost,
    });
    return res.status(201).json({ "message": "Reservation created", "id": reservation._id });
  } catch (err) {
    return res.status(400).json({ "message": err.message });
  }
}

exports.get = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate('spaceId').orFail(() => {
      return res.status(404).json({ message: "Couldn't find reservation" });
    });

    return res.status(200).json(reservation);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

exports.update = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).orFail(() => {
      return res.status(404).json({ message: "Couldn't find reservation" });
    });
    const oldStatus = reservation.status;
    reservation.updateOne(req.body).exec();

    if (req.body.status && oldStatus != req.body.status) {
      await Notification.create({
        to: reservation.reservedBy,
        level: Notification.NotificationLevels.Info,
        message: `Estado da reserva ${reservation.id} foi alterada`,
        //TODO: use frontend url
        link: `${process.env.BASE_URL}/reservations/${reservation.id}`
      });
    }

    return res.status(200).json({ message: "Success" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

exports.delete = async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id).orFail(() => {
      return res.status(404).json({ message: "Couldn't find reservation" });
    });

    return res.status(200).json({ message: "Success" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

exports.getAll = async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const paginated = req.query.paginated === 'true';
  const statusParam = req.query.status;

  try {
    let findQuery = {};

    if (req.user.role != process.env.DB_ADMIN_ROLE_ID) {
      findQuery.reservedBy = req.user.id;
    }

    if (statusParam) {
      const statuses = Array.isArray(statusParam) ? statusParam.map(Number) : [Number(statusParam)];
      findQuery.status = { $in: statuses };
    }

    let reservations;
    if (page > 0 && limit > 0) {
      reservations = await Reservation.find(findQuery)
        .limit(limit)
        .skip((page - 1) * limit)
        .populate('spaceId')
        .exec();
    } else {
      reservations = await Reservation.find(findQuery)
        .populate('spaceId')
        .exec();
    }

    if (paginated) {
      const totalItems = await Reservation.countDocuments(findQuery);
      return res.status(200).json({
        data: reservations,
        totalPages: limit > 0 ? Math.ceil(totalItems / limit) : 1
      });
    }

    return res.status(200).json(reservations);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

exports.cancel = async (req, res) => {
  const reservation = await Reservation.findById(req.params.id).orFail(() => {
    return res.status(404).json({ message: "Couldn't find reservation" });
  });

  if (reservation.reservedBy == req.user.id || req.user.role == process.env.DB_ADMIN_ROLE_ID) {
    // console.log(reservation);
    if (reservation.status == Reservation.ReservationStatuses.Cancelled) {
      return res.status(400).json({ message: "This reservation is already cancelled" })
    }
    reservation.updateOne({
      status: Reservation.ReservationStatuses.Cancelled,
    }).exec();
    return res.status(200).json({ message: "Reservation was cancelled sucessfuly" });
  }
  return res.status(400).json({ message: "This reservation doesn't belong to this user" });
}

exports.getConfirmedDates = async (req, res) => {
  try {
    const reservations = await Reservation.find({ status: Reservation.ReservationStatuses.Confirmed }).select({ startDate: true, endDate: true }).exec();

    return res.status(200).json(reservations)
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

exports.getClientHistory = async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  try {
    let reservations;
    if (page > 0 && limit > 0) {
      reservations = await Reservation.find({ reservedBy: req.params.id })
        .limit(limit)
        .skip((page - 1) * limit)
        .populate('spaceId')
        .exec();
    } else {
      reservations = await Reservation.find({ reservedBy: req.params.id }).populate('spaceId').exec();
    }
    return res.status(200).json(reservations);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.getReportsStats = async (req, res) => {
  try {
    const totalReservations = await Reservation.countDocuments({});
    const reservations = await Reservation.find({}).populate('spaceId').exec();

    let totalRevenue = 0;
    let pendingBookings = 0;
    let cancelledBookings = 0;
    let confirmedBookings = 0;
    let finishedBookings = 0;

    const spacePopularity = {};

    reservations.forEach(r => {
      if (r.status === 2 || r.status === 3) {
        totalRevenue += (r.cost || 0);
      }
      if (r.status === 0) pendingBookings++;
      if (r.status === 1) cancelledBookings++;
      if (r.status === 2) confirmedBookings++;
      if (r.status === 3) finishedBookings++;

      if (r.spaceId && r.spaceId.name) {
        const key = r.spaceId._id.toString();
        if (!spacePopularity[key]) {
          spacePopularity[key] = {
            id: r.spaceId._id,
            name: r.spaceId.name,
            count: 0
          };
        }
        spacePopularity[key].count++;
      }
    });

    const totalUsers = await User.countDocuments({ role: { $ne: process.env.DB_ADMIN_ROLE_ID } });
    const activeUsers = await User.countDocuments({ role: { $ne: process.env.DB_ADMIN_ROLE_ID }, suspended: false });
    const suspendedUsers = await User.countDocuments({ role: { $ne: process.env.DB_ADMIN_ROLE_ID }, suspended: true });

    const popularSpaces = Object.values(spacePopularity)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return res.status(200).json({
      totalReservations,
      pendingBookings,
      cancelledBookings,
      confirmedBookings,
      finishedBookings,
      totalRevenue,
      totalUsers,
      activeUsers,
      suspendedUsers,
      popularSpaces
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};