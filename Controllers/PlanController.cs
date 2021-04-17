using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using QLCT.Models;
using PagedList;

namespace QLCT.Controllers
{
    public class PlanController : Controller
    {
        public QLCTDataContext db = new QLCTDataContext();
        // GET: Plan
        // View don vi
        #region don vi
        public ActionResult IndexDivision()
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["user"] == "Leader" && Session["PB"] != "PGD")
            {
                return RedirectToAction("IndexDivisionLeader", "Plan");
            }
            if(Session["user"] == "NV" && Session["PB"] != "PGD")
            {
                return RedirectToAction("IndexDivisionNV", "Plan");
            }
            if (Session["PB"] == "PGD")
            {
                return RedirectToAction("IndexDivisionPGD", "Plan");
            }
            return View();
        }
        #region NV don vi
        public ActionResult IndexDivisionNV()
        {
            var plan = from p in db.Plans
                           join d in db.Departments
                           on p.IdDeparterment equals d.Id
                           where p.IdDeparterment == Convert.ToInt32(Session["divi"])
                           where p.IdStaff == 0
                           orderby p.FromDate descending
                           select new User_Depart_Plan
                           {
                               IdPlan = p.Id,
                               NamePlan = p.Name,
                               NameDepart = d.Name,
                               PlanContent = p.PlanContent,
                               FromDate = Convert.ToDateTime(p.FromDate),
                               ToDate = Convert.ToDateTime(p.ToDate)
                           };
            return View(plan);
        }
        [HttpPost]
        public ActionResult IndexDivisionNV(FormCollection a)
        {
            var from = Request["from"];
            var to = Request["to"];
            var notok = Request["textnotok"];
            var ok = Request["textok"];
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            var plan = from p in db.Plans
                       join d in db.Departments
                       on p.IdDeparterment equals d.Id
                       where p.IdDeparterment == Convert.ToInt32(Session["divi"])
                       where p.IdStaff == 0
                       orderby p.FromDate descending
                       select new User_Depart_Plan
                       {
                           IdPlan = p.Id,
                           NamePlan = p.Name,
                           NameDepart = d.Name,
                           PlanContent = p.PlanContent,
                           FromDate = Convert.ToDateTime(p.FromDate),
                           ToDate = Convert.ToDateTime(p.ToDate),
                           Status = p.Status
                       };
            if (ok == "true")
            {
                plan = plan.Where(p => p.Status == 1);
                if (notok == "true")
                {
                    plan = plan.Where(p => p.Status == 2);
                    if (from != "")
                    {
                        plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        if (to != "")
                        {
                            plan = plan.Where(p => p.ToDate == Convert.ToDateTime(to));
                        }
                    }
                    else
                    {
                        if (to != "")
                        {
                            plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        }
                    }
                }
                else
                {
                    if (from != "")
                    {
                        plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        if (to != "")
                        {
                            plan = plan.Where(p => p.ToDate == Convert.ToDateTime(to));
                        }
                    }
                    else
                    {
                        if (to != "")
                        {
                            plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        }
                    }
                }

            }
            else
            {
                if (notok == "true")
                {
                    plan = plan.Where(p => p.Status == 2);
                    if (from != "")
                    {
                        plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        if (to != "")
                        {
                            plan = plan.Where(p => p.ToDate == Convert.ToDateTime(to));
                        }
                    }
                    else
                    {
                        if (to != "")
                        {
                            plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        }
                    }
                }
                else
                {
                    if (from != "")
                    {
                        plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        if (to != "")
                        {
                            plan = plan.Where(p => p.ToDate == Convert.ToDateTime(to));
                        }
                    }
                    else
                    {
                        if (to != "")
                        {
                            plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        }
                    }
                }
            }
            ViewBag.plan = plan;
            return View();
        }
        #endregion
        #region PGD don vi
        public ActionResult IndexDivisionPGD()
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            var plan = from p in db.Plans
                           join d in db.Departments
                           on p.IdDeparterment equals d.Id
                           join u in db.Users
                           on p.IdStaff equals u.Id
                           where p.IdStaff ==0
                           orderby p.FromDate descending
                           select new User_Depart_Plan
                           {
                               IdPlan = p.Id,
                               NamePlan = p.Name,
                               NameDepart = d.Name,
                               NameUser = u.Name,
                               IdUser = u.Id,
                               PlanContent = p.PlanContent,
                               FromDate = Convert.ToDateTime(p.FromDate),
                               ToDate = Convert.ToDateTime(p.ToDate),
                               Status = p.Status
                           };
            return View(plan);
        }
        [HttpPost]
        public ActionResult IndexDivisionPGD(FormCollection a)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            var divi = Request["divi"];
            var from = Request["from"];
            var to = Request["to"];
            var notok = Request["textnotok"];
            var ok = Request["textok"];
            ViewBag.loadDV = db.Departments.ToList();
            var plan = from p in db.Plans
                       join d in db.Departments
                       on p.IdDeparterment equals d.Id
                       where p.IdStaff == 0
                       orderby p.FromDate descending
                       select new User_Depart_Plan
                       {
                           IdPlan = p.Id,
                           NamePlan = p.Name,
                           NameDepart = d.Name,
                           PlanContent = p.PlanContent,
                           FromDate = Convert.ToDateTime(p.FromDate),
                           ToDate = Convert.ToDateTime(p.ToDate),
                           IdDepart = Convert.ToInt32(p.IdDeparterment)
                       };
            if (ok == "true")
            {
                plan = plan.Where(p => p.Status == 1);
                if (notok == "true")
                {
                    plan = plan.Where(p => p.Status == 2);
                    if (from != "")
                    {
                        plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        if (to != "")
                        {
                            plan = plan.Where(p => p.ToDate == Convert.ToDateTime(to));
                        }
                    }
                    else
                    {
                        if (to != "")
                        {
                            plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        }
                    }
                }
                else
                {
                    if (from != "")
                    {
                        plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        if (to != "")
                        {
                            plan = plan.Where(p => p.ToDate == Convert.ToDateTime(to));
                        }
                    }
                    else
                    {
                        if (to != "")
                        {
                            plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                            if (divi != "")
                            {
                                plan.Where(p => p.IdDepart == Convert.ToInt32(divi));
                            }
                        }
                        else
                        {
                            if (divi != "")
                            {
                                plan.Where(p => p.IdDepart == Convert.ToInt32(divi));
                            }
                        }
                    }
                }

            }
            else
            {
                if (notok == "true")
                {
                    plan = plan.Where(p => p.Status == 2);
                    if (from != null)
                    {
                        plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        if (to != null)
                        {
                            plan = plan.Where(p => p.ToDate == Convert.ToDateTime(to));
                        }
                    }
                    else
                    {
                        if (to != null)
                        {
                            plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        }
                    }
                }
                else
                {
                    if (from != null)
                    {
                        plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        if (to != null)
                        {
                            plan = plan.Where(p => p.ToDate == Convert.ToDateTime(to));
                        }
                    }
                    else
                    {
                        if (to != null)
                        {
                            plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                            if (divi != null)
                            {
                                plan.Where(p => p.IdDepart == Convert.ToInt32(divi));
                            }
                        }
                        else
                        {
                            if (divi != null)
                            {
                                plan.Where(p => p.IdDepart == Convert.ToInt32(divi));
                            }
                        }
                    }
                }
            }

            ViewBag.plan = plan;
            return View();
        }
        #endregion
        #region leader don vi
        public ActionResult IndexDivisionLeader()
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            var plan = from p in db.Plans
                       join d in db.Departments
                       on p.IdDeparterment equals d.Id
                       where p.IdDeparterment == Convert.ToInt32(Session["divi"])
                       where p.IdStaff == 0
                       orderby p.FromDate descending
                       select new User_Depart_Plan
                       {
                           IdPlan = p.Id,
                           NamePlan = p.Name,
                           NameDepart = d.Name,
                           PlanContent = p.PlanContent,
                           FromDate = Convert.ToDateTime(p.FromDate),
                           ToDate = Convert.ToDateTime(p.ToDate)
                       };
            return View(plan);
        }
        [HttpPost]
        public ActionResult IndexDivisionLeader(FormCollection a)
        {
            var from = Request["from"];
            var to = Request["to"];
            var notok = Request["textnotok"];
            var ok = Request["textok"];
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            var plan = from p in db.Plans
                       join d in db.Departments
                       on p.IdDeparterment equals d.Id
                       where p.IdDeparterment == Convert.ToInt32(Session["divi"])
                       where p.IdStaff == 0
                       orderby p.FromDate descending
                       select new User_Depart_Plan
                       {
                           IdPlan = p.Id,
                           NamePlan = p.Name,
                           NameDepart = d.Name,
                           PlanContent = p.PlanContent,
                           FromDate = Convert.ToDateTime(p.FromDate),
                           ToDate = Convert.ToDateTime(p.ToDate),
                           Status = p.Status
                       };
            if (ok == "true")
            {
                plan = plan.Where(p => p.Status == 1);
                if (notok == "true")
                {
                    plan = plan.Where(p => p.Status == 2);
                    if (from != "")
                    {
                        plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        if (to != "")
                        {
                            plan = plan.Where(p => p.ToDate == Convert.ToDateTime(to));
                        }
                    }
                    else
                    {
                        if (to != "")
                        {
                            plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        }
                    }
                }
                else
                {
                    if (from != "")
                    {
                        plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        if (to != "")
                        {
                            plan = plan.Where(p => p.ToDate == Convert.ToDateTime(to));
                        }
                    }
                    else
                    {
                        if (to != "")
                        {
                            plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        }
                    }
                }

            }
            else
            {
                if (notok == "true")
                {
                    plan = plan.Where(p => p.Status == 2);
                    if (from != "")
                    {
                        plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        if (to != "")
                        {
                            plan = plan.Where(p => p.ToDate == Convert.ToDateTime(to));
                        }
                    }
                    else
                    {
                        if (to != "")
                        {
                            plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        }
                    }
                }
                else
                {
                    if (from != "")
                    {
                        plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        if (to != "")
                        {
                            plan = plan.Where(p => p.ToDate == Convert.ToDateTime(to));
                        }
                    }
                    else
                    {
                        if (to != "")
                        {
                            plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        }
                    }
                }
            }
            ViewBag.plan = plan;
            return View();
        }
        #endregion
        #endregion
        // View ca nhan
        #region ca nhan
        public ActionResult IndexPersional()
        {
            ViewBag.Uid = Convert.ToInt64(Session["id"]);
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["user"] == "Leader" && Session["PB"] != "PGD")
            {
                return RedirectToAction("IndexPersionalLeader", "Plan");
            }
            if (Session["user"] == "NV" && Session["PB"] != "PGD")
            {
                return RedirectToAction("IndexPersionalNV", "Plan");
            }
            if (Session["PB"] == "PGD")
            {
                return RedirectToAction("IndexPersionalPGD", "Plan");
            }
            return View();
        }
        #region NV ca nhan
        public ActionResult IndexPersionalNV()
        {
            int uid = Convert.ToInt32(Session["id"]);
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            var plan = from p in db.Plans
                           join u in db.Users on p.IdStaff equals u.Id
                           join d in db.Departments on p.IdDeparterment equals d.Id
                           where p.IdStaff == uid
                           orderby p.FromDate descending
                           select new User_Depart_Plan
                           {
                               IdPlan = p.Id,
                               NamePlan = p.Name,
                               NameDepart = d.Name,
                               NameUser = u.Name,
                               PlanContent = p.PlanContent,
                               FromDate = Convert.ToDateTime(p.FromDate),
                               ToDate = Convert.ToDateTime(p.ToDate)
                           };
            return View(plan);
        }
        [HttpPost]
        public ActionResult IndexPersionalNV(FormCollection a)
        {
            int uid = Convert.ToInt32(Session["id"]);
            var divi = Request["divi"];
            var from = Request["from"];
            var to = Request["to"];
            var notok = Request["textnotok"];
            var ok = Request["textok"];
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            var plan = from p in db.Plans
                       join u in db.Users on p.IdStaff equals u.Id
                       join d in db.Departments on p.IdDeparterment equals d.Id
                       where p.IdStaff == uid
                       orderby p.FromDate descending
                       select new User_Depart_Plan
                       {
                           IdPlan = p.Id,
                           NamePlan = p.Name,
                           NameDepart = d.Name,
                           NameUser = u.Name,
                           PlanContent = p.PlanContent,
                           FromDate = Convert.ToDateTime(p.FromDate),
                           ToDate = Convert.ToDateTime(p.ToDate)
                       };
            if (ok == "true")
            {
                plan = plan.Where(p => p.Status == 1);
                if (notok == "true")
                {
                    plan = plan.Where(p => p.Status == 2);
                    if (from != "")
                    {
                        plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        if (to != "")
                        {
                            plan = plan.Where(p => p.ToDate == Convert.ToDateTime(to));
                        }
                    }
                    else
                    {
                        if (to != "")
                        {
                            plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        }
                    }
                }
                else
                {
                    if (from != "")
                    {
                        plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        if (to != null)
                        {
                            plan = plan.Where(p => p.ToDate == Convert.ToDateTime(to));
                        }
                    }
                    else
                    {
                        if (to != "")
                        {
                            plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        }
                    }
                }

            }
            else
            {
                if (notok == "true")
                {
                    plan = plan.Where(p => p.Status == 2);
                    if (from != "")
                    {
                        plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        if (to != "")
                        {
                            plan = plan.Where(p => p.ToDate == Convert.ToDateTime(to));
                        }
                    }
                    else
                    {
                        if (to != "")
                        {
                            plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        }
                    }
                }
                else
                {
                    if (from != "")
                    {
                        plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        if (to != "")
                        {
                            plan = plan.Where(p => p.ToDate == Convert.ToDateTime(to));
                        }
                    }
                    else
                    {
                        if (to != "")
                        {
                            plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        }
                    }
                }
            }
            return View(plan);
        }
        #endregion
        #region PGD ca nhan
        public ActionResult IndexPersionalPGD()
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            ViewBag.loadDV = db.Departments.ToList();
            var list = (from p in db.Plans
                        join u in db.Users on p.IdStaff equals u.Id
                        join d in db.Departments on p.IdDeparterment equals d.Id
                        orderby p.FromDate descending
                        select new User_Depart_Plan
                        {
                            IdPlan = p.Id,
                            NamePlan = p.Name,
                            NameDepart = d.Name,
                            NameUser = u.Name,
                            IdUser = u.Id,
                            PlanContent = p.PlanContent,
                            FromDate = Convert.ToDateTime(p.FromDate),
                            ToDate = Convert.ToDateTime(p.ToDate),
                            Status = p.Status
                        }); 
            return View(list);
        }
        [HttpPost]
        public ActionResult IndexPersionalPGD(FormCollection a)
        {
            var divi = Request["divi"];
            var from = Request["from"];
            var to = Request["to"];
            var notok = Request["textnotok"];
            var ok = Request["textok"];
            ViewBag.loadDV = db.Departments.ToList();
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            var plan = from p in db.Plans
                       join u in db.Users on p.IdStaff equals u.Id
                       join d in db.Departments on p.IdDeparterment equals d.Id
                       orderby p.FromDate descending
                       select new User_Depart_Plan
                       {
                           IdPlan = p.Id,
                           NamePlan = p.Name,
                           NameDepart = d.Name,
                           IdDepart = d.Id,
                           NameUser = u.Name,
                           PlanContent = p.PlanContent,
                           FromDate = Convert.ToDateTime(p.FromDate),
                           ToDate = Convert.ToDateTime(p.ToDate)
                       };
            if (ok == "true")
            {
                plan = plan.Where(p => p.Status == 1);
                if (notok == "true")
                {
                    plan = plan.Where(p => p.Status == 2);
                    if (from != "")
                    {
                        plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        if (to != "")
                        {
                            plan = plan.Where(p => p.ToDate == Convert.ToDateTime(to));
                        }
                    }
                    else
                    {
                        if (to != "")
                        {
                            plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        }
                    }
                }
                else
                {
                    if (from != "")
                    {
                        plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        if (to != "")
                        {
                            plan = plan.Where(p => p.ToDate == Convert.ToDateTime(to));
                        }
                    }
                    else
                    {
                        if (to != "")
                        {
                            plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                            if (divi != "")
                            {
                                plan = plan.Where(p => p.IdDepart == Convert.ToInt32(divi));
                            }
                        }
                        else
                        {
                            if (divi != "")
                            {
                                plan = plan.Where(p => p.IdDepart == Convert.ToInt32(divi));
                            }
                        }
                    }
                }

            }
            else
            {
                if (notok == "true")
                {
                    plan = plan.Where(p => p.Status == 2);
                    if (from != "")
                    {
                        plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        if (to != "")
                        {
                            plan = plan.Where(p => p.ToDate == Convert.ToDateTime(to));
                        }
                    }
                    else
                    {
                        if (to != "")
                        {
                            plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        }
                    }
                }
                else
                {
                    if (from != "")
                    {
                        plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        if (to != "")
                        {
                            plan = plan.Where(p => p.ToDate == Convert.ToDateTime(to));
                        }
                    }
                    else
                    {
                        if (to != "")
                        {
                            plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                            if (divi != "")
                            {
                                plan = plan.Where(p => p.IdDepart == Convert.ToInt32(divi));
                            }
                        }
                        else
                        {
                            if (divi != "")
                            {
                                plan = plan.Where(p => p.IdDepart == Convert.ToInt32(divi));
                            }
                        }
                    }
                }
            }
            return View(plan);
        }
        #endregion
        #region Leader ca nhan
        public ActionResult IndexPersionalLeader()
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            var uid = Convert.ToInt64(Session["id"]);
            ViewBag.loadNv = from d in db.Departments
                             join u in db.Users on d.Id equals u.IdDepartment
                             where d.Id == Convert.ToInt32(Session["divi"])
                             select new UserDepart
                             {
                                 IdDepart = d.Id,
                                 NameUser = u.Name,
                                 IdUser = u.Id
                             };
            ViewBag.plan = from p in db.Plans
                           join u in db.Users on p.IdStaff equals u.Id
                           join d in db.Departments on p.IdDeparterment equals d.Id
                           where p.IdDeparterment == Convert.ToInt32(Session["divi"])
                           where p.IdStaff != 0
                           orderby p.FromDate descending
                           select new User_Depart_Plan
                           {
                               IdPlan = p.Id,
                               NamePlan = p.Name,
                               NameDepart = d.Name,
                               NameUser = u.Name,
                               PlanContent = p.PlanContent,
                               FromDate = Convert.ToDateTime(p.FromDate),
                               ToDate = Convert.ToDateTime(p.ToDate)
                           };
            return View();
        }
        [HttpPost]
        public ActionResult IndexPersionalLeader(FormCollection a)
        {
            var divi = Request["divi"];
            var NV = Request["NV"];
            var from = Request["from"];
            var to = Request["to"];
            var notok = Request["textnotok"];
            var ok = Request["textok"];
            ViewBag.loadNV = from d in db.Departments
                             join u in db.Users
                             on d.Id equals u.IdDepartment
                             where d.Id == Convert.ToInt32(Session["divi"])
                             select new UserDepart
                             {
                                 IdUser = u.Id,
                                 NameUser = u.Name
                             };
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            var plan = from p in db.Plans
                       join u in db.Users on p.IdStaff equals u.Id
                       join d in db.Departments on p.IdDeparterment equals d.Id
                       where p.IdDeparterment == Convert.ToInt32(Session["divi"])
                       where p.IdStaff != null
                       orderby p.FromDate descending
                       select new User_Depart_Plan
                       {
                           IdPlan = p.Id,
                           NamePlan = p.Name,
                           NameDepart = d.Name,
                           NameUser = u.Name,
                           PlanContent = p.PlanContent,
                           FromDate = Convert.ToDateTime(p.FromDate),
                           ToDate = Convert.ToDateTime(p.ToDate),
                           IdUser = Convert.ToInt32(u.Id)
                       };
            if (ok == "true")
            {
                plan = plan.Where(p => p.Status == 1);
                if (notok == "true")
                {
                    plan = plan.Where(p => p.Status == 2);
                    if (from != "")
                    {
                        plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        if (to != "")
                        {
                            plan = plan.Where(p => p.ToDate == Convert.ToDateTime(to));
                        }
                    }
                    else
                    {
                        if (to != "")
                        {
                            plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        }
                    }
                }
                else
                {
                    if (from != "")
                    {
                        plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        if (to != "")
                        {
                            plan = plan.Where(p => p.ToDate == Convert.ToDateTime(to));
                        }
                    }
                    else
                    {
                        if (to != "")
                        {
                            plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                            if (NV != "")
                            {
                                plan = plan.Where(p => p.IdUser == Convert.ToInt32(NV));
                            }
                        }
                        else
                        {
                            if (NV != "")
                            {
                                plan = plan.Where(p => p.IdUser == Convert.ToInt32(NV));
                            }
                        }
                    }
                }

            }
            else
            {
                if (notok == "true")
                {
                    plan = plan.Where(p => p.Status == 2);
                    if (from != "")
                    {
                        plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        if (to != "")
                        {
                            plan = plan.Where(p => p.ToDate == Convert.ToDateTime(to));
                        }
                    }
                    else
                    {
                        if (to != "")
                        {
                            plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        }
                    }
                }
                else
                {
                    if (from != "")
                    {
                        plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                        if (to != "")
                        {
                            plan = plan.Where(p => p.ToDate == Convert.ToDateTime(to));
                        }
                    }
                    else
                    {
                        if (to != "")
                        {
                            plan = plan.Where(p => p.FromDate == Convert.ToDateTime(from));
                            if (NV != "")
                            {
                                plan = plan.Where(p => p.IdUser == Convert.ToInt32(NV));
                            }
                        }
                        else
                        {
                            if (NV != "")
                            {
                                plan = plan.Where(p => p.IdUser == Convert.ToInt32(NV));
                            }
                        }
                    }
                }
            }
            ViewBag.plan = plan;
            return View();
        }
        #endregion
        #endregion
        // Insert
        #region Leader
        public ActionResult InsertLeader()
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["user"] != "Leader")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
                return View();
            }
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            ViewBag.loadNv = from d in db.Departments
                             join u in db.Users on d.Id equals u.IdDepartment
                             where d.Id == Convert.ToInt32(Session["divi"])
                             select new UserDepart
                             {
                                 IdDepart = d.Id,
                                 NameUser = u.Name,
                                 IdUser = u.Id
                             };
            return View();
        }
        [HttpPost]
        public ActionResult InsertLeader(Plan plan, FormCollection a)
        {
            string content = Request["PlanContent"];
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            plan.Name = Request["Name"];
            plan.PlanContent = Request["PlanContent"];
            plan.IdStaff = Convert.ToInt32(Request["IdStaff"]);
            plan.IdDeparterment = Convert.ToInt32(Session["divi"]);
            plan.FromDate = Convert.ToDateTime(Request["FromDate"]);
            plan.ToDate = Convert.ToDateTime(Request["ToDate"]);
            plan.Status = 2;
            db.Plans.InsertOnSubmit(plan);
            db.SubmitChanges();
            return this.InsertLeader();
        }
        #endregion
        #region PGD
        public ActionResult InsertPGD()
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["user"] != "Leader" || Session["PB"] != "PGD")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
            }
            ViewBag.loadDV = db.Departments.ToList();
            ViewBag.IdUser = from u in db.Users
                             select u.Name;
            return View();
        }
        [HttpPost]
        public ActionResult InsertPGD(Plan plan, FormCollection a)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            plan.Name = Request["Name"];
            plan.PlanContent = Request["PlanContent"];
            plan.IdStaff = Convert.ToInt32(Request["IdDivi"]);
            plan.FromDate = Convert.ToDateTime(Request["FromDate"]);
            plan.IdStaff = 0;
            plan.ToDate = Convert.ToDateTime(Request["ToDate"]);
            plan.Status = 2;
            db.Plans.InsertOnSubmit(plan);
            db.SubmitChanges();
            return this.InsertPGD();
        }
        #endregion
        // Update
        #region Leader
        public ActionResult UpdateLeader(int id)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["user"] != "Leader")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
                return View();
            }
            ViewBag.loadNv = from d in db.Departments
                             join u in db.Users on d.Id equals u.IdDepartment
                             where d.Id == Convert.ToInt32(Session["divi"])
                             select new UserDepart
                             {
                                 IdDepart = d.Id,
                                 NameUser = u.Name,
                                 IdUser = u.Id
                             };
            var plan = db.Plans.First(d => d.Id == id);
            return View(plan);
        }
        [HttpPost]
        public ActionResult UpdateLeader(int id, Plan plan, FormCollection a)
        {
            var ok = Request["textok"];
            string content = Request["PlanContent"];
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            plan.Name = Request["Name"];
            plan.PlanContent = Request["PlanContent"];
            plan.IdStaff = Convert.ToInt32(Request["IdStaff"]);
            plan.IdDeparterment = Convert.ToInt32(Session["divi"]);
            plan.FromDate = Convert.ToDateTime(Request["FromDate"]);
            plan.ToDate = Convert.ToDateTime(Request["ToDate"]);
            if (ok == "true")
            {
                plan.Status = 1;
            }
            else
            {
                plan.Status = 2;
            }
            UpdateModel(plan);
            db.SubmitChanges();
            return this.UpdateLeader(id);
        }
        #endregion
        #region PGD
        public ActionResult UpdatePGD(int id)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["user"] != "Leader" || Session["PB"] != "PGD")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
            }
            ViewBag.loadDV = db.Departments.ToList();
            ViewBag.IdUser = from u in db.Users
                             select u.Name;
            var plan = db.Plans.First(d => d.Id == id);
            return View(plan);
        }
        [HttpPost]
        public ActionResult UpdatePGD(int id, Plan plan, FormCollection a)
        {
            var ok = Request["textok"];
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            plan.Name = Request["Name"];
            plan.PlanContent = Request["PlanContent"];
            plan.IdStaff = Convert.ToInt32(Request["IdDivi"]);
            plan.FromDate = Convert.ToDateTime(Request["FromDate"]);
            plan.IdStaff = 0;
            plan.ToDate = Convert.ToDateTime(Request["ToDate"]);
            plan.Status = 2;
            if (ok == "true")
            {
                plan.Status = 1;
            }
            else
            {
                plan.Status = 2;
            }
            UpdateModel(plan);
            db.SubmitChanges();
            return this.UpdatePGD(id);
        }
        #endregion
        // Delete -- Not Update IsDelete
        public ActionResult Delete(int id)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["user"] != "Leader" || Session["user"] != "PGD")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
                return View();
            }
            var plan = db.Plans.First(d => d.Id == id);
            db.Plans.DeleteOnSubmit(plan);
            return RedirectToAction("Index");
        }
    }
}