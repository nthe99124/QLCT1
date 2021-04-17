using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using QLCT.Models;
using PagedList;

namespace QLCT.Controllers
{
    public class LogController : Controller
    {
        public QLCTDataContext db = new QLCTDataContext();
        // GET: Log
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Index(User us)  
        {
            string user = Request["user"];
            string pass = Request["pass"];
            us = db.Users.Where(u => u.UserName == user && u.PassWord == pass).SingleOrDefault();
            var uss = db.Users.Where(u => u.UserName == user && u.PassWord == pass);

            User usPGD = uss.Where(u => u.IdDepartment == 1).SingleOrDefault();
            User usPNS = uss.Where(u=> u.IdDepartment == 2).SingleOrDefault();
            User usPKD = uss.Where(u => u.IdDepartment == 3).SingleOrDefault();
            User usLead = uss.Where(u => u.Status == 1).SingleOrDefault();
            User usNV = uss.Where(u => u.Status == 0).SingleOrDefault();
            if (us != null)
            {
                if (usPGD != null)
                {
                    Session["PB"] = "PGD";
                    Session["divi"] = "1";
                }
                //
                if (usPNS != null)
                {
                    Session["PB"] = "PNS";
                    Session["divi"] = "2";
                }
                //
                if (usPKD != null)
                {
                    Session["PB"] = "PKD";
                    Session["divi"] = "3";
                }
                //
                if (usLead != null)
                {
                    Session["user"] = "Leader";
                }
                if (usNV != null)
                {
                    Session["user"] = "NV";
                }
                Session["id"] = us.Id;
                return RedirectToAction("Index", "Dashboard");
            }
            else
                ViewBag.error = "Username hoặc Password sai!";
            return this.Index();
        }
        public ActionResult SignOut()
        {
            Session["user"] = null;
            Session["PB"] = null;
            return View();
        }
    }
}