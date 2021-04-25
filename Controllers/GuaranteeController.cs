using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using QLCT.Models;
using PagedList;

namespace QLCT.Controllers
{
    public class GuaranteeController : Controller
    {
        // GET: Guarantee

        public QLCTDataContext db = new QLCTDataContext();
        // View
        public ActionResult Index()
        {
            var uid = Session["user"];
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["user"] != "PGD" && Session["user"] != "PKD")
            {
                ViewBag.notify = "Bạn không có quyền truy cập";
            }
            var list = from b in db.Bills
                       join u in db.Users on b.IdUser equals u.Id
                       join c in db.Customers on b.IdCustormer equals c.Id
                       join de in db.DetailsBills on b.IdDetails equals de.Id
                       where b.IsDelete == false
                       where b.IdUser == 7
                       select new User_DetailsBill_Cus_Bill
                       {
                           IdBill = b.Id,
                           NameBill = b.NameBill,
                           IdUser = u.Id,
                           NameUser = u.Name,
                           NameCus = c.Name,
                           FileHD = b.UrlBill,
                           Date = Convert.ToDateTime(b.Date)
                       };
            return View(list);
        }
    }
}